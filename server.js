// Servidor del Test DWEC: sirve /public y guarda el ranking en Postgres.
// Sin DATABASE_URL usa memoria (solo para probar en local).
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const TEMAS = ['1', '2', '3', '4', 'all'];
const LONGS = ['20', 'all'];
const MODES = TEMAS.flatMap((t) => LONGS.map((l) => `${t}-${l}`));
const MIN_RAPIDO = 0.8; // el ranking por tiempo solo cuenta partidas con al menos un 80 % de aciertos

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

/* ---------- Almacenamiento ---------- */
let db;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'off' ? false : { rejectUnauthorized: false } });
  db = {
    async init() {
      await pool.query(`CREATE TABLE IF NOT EXISTS dwec_players (name_key TEXT PRIMARY KEY, name TEXT NOT NULL, token_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`);
      await pool.query(`CREATE TABLE IF NOT EXISTS dwec_scores (id SERIAL PRIMARY KEY, name_key TEXT NOT NULL, mode TEXT NOT NULL, ok INT NOT NULL, total INT NOT NULL, ms INT NOT NULL, run_id TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT now())`);
      await pool.query(`CREATE INDEX IF NOT EXISTS dwec_scores_mode ON dwec_scores (mode)`);
    },
    async player(key) {
      const r = await pool.query('SELECT name, token_hash FROM dwec_players WHERE name_key = $1', [key]);
      return r.rows[0] || null;
    },
    async addPlayer(key, name, th) {
      await pool.query('INSERT INTO dwec_players (name_key, name, token_hash) VALUES ($1, $2, $3) ON CONFLICT (name_key) DO NOTHING', [key, name, th]);
    },
    async addScore(s) {
      // run_id único: si el cliente reenvía la misma partida (cola de pendientes) no se duplica
      await pool.query('INSERT INTO dwec_scores (name_key, mode, ok, total, ms, run_id) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (run_id) DO NOTHING', [s.key, s.mode, s.ok, s.total, s.ms, s.runId]);
    },
    async ranking(mode) {
      const nota = await pool.query(`SELECT p.name, b.ok, b.total, b.ms FROM (
          SELECT DISTINCT ON (name_key) name_key, ok, total, ms FROM dwec_scores WHERE mode = $1
          ORDER BY name_key, (ok::float / total) DESC, ms ASC) b
        JOIN dwec_players p USING (name_key) ORDER BY (b.ok::float / b.total) DESC, b.ms ASC LIMIT 50`, [mode]);
      const rapido = await pool.query(`SELECT p.name, b.ok, b.total, b.ms FROM (
          SELECT DISTINCT ON (name_key) name_key, ok, total, ms FROM dwec_scores WHERE mode = $1 AND ok::float / total >= $2
          ORDER BY name_key, ms ASC) b
        JOIN dwec_players p USING (name_key) ORDER BY b.ms ASC LIMIT 50`, [mode, MIN_RAPIDO]);
      return { nota: nota.rows, rapido: rapido.rows };
    },
  };
} else {
  const players = new Map();
  const scores = [];
  const best = (rows, cmp) => {
    const m = new Map();
    for (const r of rows) if (!m.has(r.key) || cmp(r, m.get(r.key)) < 0) m.set(r.key, r);
    return [...m.values()].sort(cmp).slice(0, 50).map((r) => ({ name: players.get(r.key).name, ok: r.ok, total: r.total, ms: r.ms }));
  };
  const byNota = (a, b) => b.ok / b.total - a.ok / a.total || a.ms - b.ms;
  db = {
    async init() { console.log('Sin DATABASE_URL: ranking en memoria'); },
    async player(key) { return players.get(key) || null; },
    async addPlayer(key, name, th) { if (!players.has(key)) players.set(key, { name, token_hash: th }); },
    async addScore(s) { if (!scores.some((x) => x.runId === s.runId)) scores.push(s); },
    async ranking(mode) {
      const rows = scores.filter((s) => s.mode === mode);
      return { nota: best(rows, byNota), rapido: best(rows.filter((r) => r.ok / r.total >= MIN_RAPIDO), (a, b) => a.ms - b.ms) };
    },
  };
}

/* ---------- Validación (todo lo que llega del navegador es no fiable) ---------- */
function cleanName(n) {
  if (typeof n !== 'string') return null;
  const name = n.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (name.length < 2 || name.length > 20) return null;
  if (!/^[\p{L}\p{N} _.\-]+$/u.test(name)) return null;
  return name;
}
const keyOf = (name) => name.toLocaleLowerCase('es');
const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');
const validToken = (t) => typeof t === 'string' && /^[a-f0-9]{32,64}$/.test(t);

// Reserva el nombre para el token de ese dispositivo. Devuelve null si lo tiene otra persona.
async function claim(name, token) {
  const key = keyOf(name);
  const th = hashToken(token);
  let p = await db.player(key);
  if (!p) { await db.addPlayer(key, name, th); p = await db.player(key); }
  return p.token_hash === th ? key : null;
}

function validScore(b) {
  if (!MODES.includes(b.mode)) return 'Modo no válido';
  const ok = b.ok, total = b.total, ms = b.ms;
  if (![ok, total, ms].every(Number.isInteger)) return 'Datos no válidos';
  if (total < 1 || total > 600 || ok < 0 || ok > total) return 'Datos no válidos';
  if (b.mode.endsWith('-20') && total !== 20) return 'Datos no válidos';
  if (ms < total * 400 || ms > 6 * 3600 * 1000) return 'Tiempo no válido';
  if (typeof b.runId !== 'string' || !/^[a-z0-9]{8,40}$/.test(b.runId)) return 'Datos no válidos';
  return null;
}

/* ---------- HTTP ---------- */
function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 4096) { reject(new Error('too big')); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { reject(new Error('bad json')); } });
    req.on('error', reject);
  });
}

async function api(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/ranking') {
    const mode = url.searchParams.get('mode');
    if (!MODES.includes(mode)) return send(res, 400, { error: 'Modo no válido' });
    return send(res, 200, await db.ranking(mode));
  }
  if (req.method === 'POST' && (url.pathname === '/api/claim' || url.pathname === '/api/score')) {
    let b;
    try { b = await readBody(req); } catch { return send(res, 400, { error: 'Petición no válida' }); }
    const name = cleanName(b.name);
    if (!name) return send(res, 400, { error: 'El nombre debe tener entre 2 y 20 letras, números, espacios, puntos, guiones o guiones bajos' });
    if (!validToken(b.token)) return send(res, 400, { error: 'Petición no válida' });
    const key = await claim(name, b.token);
    if (!key) return send(res, 409, { error: 'Ese nombre ya lo usa otra persona. Elige otro.' });
    if (url.pathname === '/api/claim') return send(res, 200, { name });
    const err = validScore(b);
    if (err) return send(res, 400, { error: err });
    await db.addScore({ key, mode: b.mode, ok: b.ok, total: b.total, ms: b.ms, runId: b.runId });
    return send(res, 200, { saved: true });
  }
  return send(res, 404, { error: 'No encontrado' });
}

function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(PUB, p));
  if (!file.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('No encontrado'); }
    // no-cache: el navegador revalida, así una actualización llega en la siguiente carga sin romper la pestaña abierta
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    if (url.pathname === '/health') return send(res, 200, { ok: true });
    serveStatic(req, res, url);
  } catch (e) {
    console.error(e);
    send(res, 500, { error: 'Error del servidor, inténtalo en un momento' });
  }
});

db.init().then(() => server.listen(PORT, () => console.log('Test DWEC en http://localhost:' + PORT)))
  .catch((e) => { console.error('No se pudo iniciar la base de datos', e); process.exit(1); });

// Render envía SIGTERM al desplegar: terminamos las peticiones en curso antes de salir
process.on('SIGTERM', () => server.close(() => process.exit(0)));
