// Ejercicios de los PDF resueltos paso a paso. Solo se usa lo que se ve en UD1-UD3.
// amp: true = ejercicio de ampliación (los más importantes para el examen).
window.EJERCICIOS = [
  {
    ud: 2, amp: true, titulo: "Nota de la primera evaluación",
    enunciado: "Pide por teclado NotaProyecto y NotaExamen (de 0 a 10). Muestra la media y la calificación: si alguna nota es menor de 4,5 → Suspenso; si las dos son ≥ 4,5 pero la media < 5 → Suspenso; media de 5 a menos de 7 → Aprobado; de 7 a menos de 9 → Notable; 9 o más → Sobresaliente.",
    pasos: [
      "Pide las dos notas con prompt(). prompt devuelve texto, así que conviértelo a número con parseFloat() (las notas pueden tener decimales).",
      "Comprueba que son números válidos y que están entre 0 y 10: usa isNaN() (recuerda que NaN no se puede comparar con ===).",
      "Calcula la media: (NotaProyecto + NotaExamen) / 2.",
      "Mira primero el caso más restrictivo: si cualquiera de las dos es menor de 4,5 es Suspenso, da igual la media. Usa || (o).",
      "Si no, encadena if / else if de mayor a menor media: ≥ 9, ≥ 7, ≥ 5 y, si no llega, Suspenso.",
      "Muestra la media (toFixed(2) para dos decimales) y la calificación."
    ],
    codigo: String.raw`let NotaProyecto = parseFloat(prompt("Nota del proyecto (0-10):"));
let NotaExamen = parseFloat(prompt("Nota del examen (0-10):"));

if (isNaN(NotaProyecto) || isNaN(NotaExamen) ||
    NotaProyecto < 0 || NotaProyecto > 10 ||
    NotaExamen < 0 || NotaExamen > 10) {
  alert("Las notas deben ser números entre 0 y 10");
} else {
  let media = (NotaProyecto + NotaExamen) / 2;
  let calificacion;

  if (NotaProyecto < 4.5 || NotaExamen < 4.5) {
    calificacion = "Suspenso";
  } else if (media >= 9) {
    calificacion = "Sobresaliente";
  } else if (media >= 7) {
    calificacion = "Notable";
  } else if (media >= 5) {
    calificacion = "Aprobado";
  } else {
    calificacion = "Suspenso";
  }

  document.write("Media: " + media.toFixed(2) + "<br>");
  document.write("Calificación: " + calificacion);
}`,
    trampa: "Proyecto 4,5 y examen 5 da media 4,75: las dos pasan del 4,5 pero la media no llega a 5 → Suspenso."
  },
  {
    ud: 2, amp: true, titulo: "Verificar el DNI (dni.js · CalculoDNI)",
    enunciado: "Pide el número y la letra del DNI y di si es correcto. Controla: longitud del número incorrecta, letra no introducida y carácter de la letra incorrecto. No existen DNI negativos ni mayores de 99.999.999. La letra se calcula con el módulo del total de posiciones del array abecedario.",
    pasos: [
      "Crea el array abecedario con las 23 letras en el orden que da el enunciado.",
      "Pide el número y la letra con prompt(). Si la letra viene vacía o es null → «Letra no introducida».",
      "Comprueba la longitud: el número tiene como mucho 8 cifras (99.999.999). Usa .length sobre el texto.",
      "Convierte el número con Number() y comprueba que no es NaN, que no es negativo y que no pasa de 99999999.",
      "Pasa la letra a mayúsculas con toUpperCase() y comprueba que es un solo carácter y que está en el abecedario.",
      "Calcula la letra correcta: abecedario[numero % abecedario.length]. abecedario.length vale 23.",
      "Compara la letra calculada con la introducida usando === y muestra si es correcto o incorrecto."
    ],
    codigo: String.raw`let abecedario = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B',
                  'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];

let textoNumero = prompt("Número de DNI (sin letra):");
let letra = prompt("Letra del DNI:");

if (letra === null || letra === "") {
  alert("Letra no introducida");
} else if (textoNumero === null || textoNumero.length < 1 || textoNumero.length > 8) {
  alert("Longitud del número incorrecta");
} else {
  let numero = Number(textoNumero);
  letra = letra.toUpperCase();

  let letraValida = false;
  for (let l of abecedario) {
    if (l === letra) { letraValida = true; }
  }

  if (isNaN(numero) || numero < 0 || numero > 99999999) {
    alert("El número de DNI no existe");
  } else if (letra.length !== 1 || !letraValida) {
    alert("Carácter de la letra incorrecto");
  } else {
    let letraCorrecta = abecedario[numero % abecedario.length];
    if (letraCorrecta === letra) {
      alert("DNI correcto");
    } else {
      alert("DNI incorrecto: la letra debería ser " + letraCorrecta);
    }
  }
}`,
    trampa: "12345678 % 23 = 14 y abecedario[14] es 'Z': el DNI 12345678Z es correcto."
  },
  {
    ud: 3, amp: true, titulo: "Tabla de 8 filas por 8 celdas",
    enunciado: "Crea con JavaScript una tabla de 8 filas por 8 celdas. (La disposición exacta de los elementos viene en EjercicioAmpliacion1.7z, que no está en la carpeta: aquí se rellena como un tablero alterno; cambia el contenido de cada celda según lo que pida el archivo.)",
    pasos: [
      "Necesitas dos bucles for anidados: el de fuera recorre las 8 filas y el de dentro las 8 celdas de cada fila.",
      "Ve construyendo el HTML en una variable de texto: abre <table>, en cada fila abre <tr>, en cada celda escribe <td>…</td>, cierra </tr> y al final </table>.",
      "Para decidir qué va en cada celda usa la fila y la columna. Ejemplo: (fila + columna) % 2 === 0 alterna como un tablero de ajedrez.",
      "Cuando el texto esté completo, escríbelo con document.write() o mételo en un elemento con getElementById(...).innerHTML."
    ],
    codigo: String.raw`let html = "<table border='1'>";

for (let fila = 0; fila < 8; fila++) {
  html += "<tr>";
  for (let col = 0; col < 8; col++) {
    if ((fila + col) % 2 === 0) {
      html += "<td style='background:black; color:white'>" + fila + "," + col + "</td>";
    } else {
      html += "<td>" + fila + "," + col + "</td>";
    }
  }
  html += "</tr>";
}

html += "</table>";
document.getElementById("tablero").innerHTML = html;
// En el HTML: <div id="tablero"></div>`,
    trampa: "Si escribes la tabla celda a celda con varios document.write(), ciérralas siempre en orden: </td> → </tr> → </table>."
  },
  {
    ud: 2, amp: false, titulo: "Nombre completo y año de nacimiento",
    enunciado: "Pide nombre, primer apellido y edad. Guarda en fullName el nombre y el apellido separados por un espacio y calcula el año de nacimiento (sin tener en cuenta el mes). Muestra cada dato en una línea.",
    pasos: [
      "Guarda cada prompt() en su variable: nombre, apellido y edad.",
      "Concatena con +: nombre + \" \" + apellido.",
      "Para el año actual usa new Date().getFullYear() y réstale la edad (pásala a número con Number()).",
      "Muestra los datos con console.log o document.write y un <br> entre líneas."
    ],
    codigo: String.raw`let nombre = prompt("Introduce tu nombre");
let apellido = prompt("Introduce tu primer apellido");
let edad = Number(prompt("Introduce tu edad"));

let fullName = nombre + " " + apellido;
let year = new Date().getFullYear() - edad;

document.write("Nombre completo: " + fullName + "<br>");
document.write("Año de nacimiento: " + year);`,
    trampa: "Sin Number(), restar sí funciona (el - convierte), pero sumar con + concatenaría textos."
  },
  {
    ud: 2, amp: false, titulo: "Par o impar",
    enunciado: "Introduce un número por teclado y di si es par o impar usando el módulo %.",
    pasos: [
      "Pide el número y conviértelo con Number().",
      "n % 2 da el resto de dividir entre 2: si es 0 es par; si no, impar.",
      "Usa if / else para mostrar el resultado."
    ],
    codigo: String.raw`let n = Number(prompt("Introduce un número"));

if (n % 2 === 0) {
  alert(n + " es par");
} else {
  alert(n + " es impar");
}`,
    trampa: "La misma idea sirve para «múltiplo de»: a % b === 0 significa que a es múltiplo de b."
  },
  {
    ud: 2, amp: false, titulo: "¿Es múltiplo de otro número?",
    enunciado: "Detecta si un número es múltiplo de otro.",
    pasos: [
      "Pide los dos números y conviértelos con Number().",
      "a es múltiplo de b si el resto a % b es 0.",
      "Cuidado con b = 0: no se puede dividir entre 0, compruébalo antes."
    ],
    codigo: String.raw`let a = Number(prompt("Primer número"));
let b = Number(prompt("Segundo número"));

if (b === 0) {
  alert("No se puede comprobar con 0");
} else if (a % b === 0) {
  alert(a + " es múltiplo de " + b);
} else {
  alert(a + " no es múltiplo de " + b);
}`,
    trampa: ""
  },
  {
    ud: 2, amp: false, titulo: "Los 12 meses con un for",
    enunciado: "Crea un array con los 12 meses del año y muestra cada mes con un for.",
    pasos: [
      "Crea el array con los 12 nombres entre comillas.",
      "Recorre desde i = 0 hasta i < meses.length (las posiciones empiezan en 0).",
      "Muestra meses[i] en cada vuelta."
    ],
    codigo: String.raw`let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
             "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

for (let i = 0; i < meses.length; i++) {
  document.write(meses[i] + "<br>");
}`,
    trampa: "Si pones i <= meses.length, la última vuelta lee meses[12], que es undefined."
  },
  {
    ud: 2, amp: false, titulo: "Comparar dos números",
    enunciado: "Compara dos números enteros para saber cuál es mayor y comprueba si son positivos.",
    pasos: [
      "Pide los dos números con prompt() y conviértelos con parseInt().",
      "Con if / else if / else decide: a mayor, b mayor o iguales.",
      "Comprueba por separado si cada uno es positivo (> 0)."
    ],
    codigo: String.raw`let a = parseInt(prompt("Primer número"));
let b = parseInt(prompt("Segundo número"));

if (a > b) {
  document.write(a + " es mayor que " + b + "<br>");
} else if (b > a) {
  document.write(b + " es mayor que " + a + "<br>");
} else {
  document.write("Son iguales<br>");
}

document.write(a + (a > 0 ? " es positivo" : " no es positivo") + "<br>");
document.write(b + (b > 0 ? " es positivo" : " no es positivo"));`,
    trampa: "Compara números, no textos: \"10\" > \"9\" es false como texto, por eso se usa parseInt."
  },
  {
    ud: 2, amp: false, titulo: "Factorial con un for",
    enunciado: "Muestra en el documento el factorial de un número introducido por teclado. Declara una variable para el número y otra para el resultado. Usa un for.",
    pasos: [
      "El factorial de n es 1 · 2 · 3 · … · n (y el de 0 es 1).",
      "Empieza el resultado en 1, nunca en 0, porque vas a multiplicar.",
      "Recorre de i = 1 a i <= n multiplicando: resultado = resultado * i.",
      "Muestra el resultado con document.write()."
    ],
    codigo: String.raw`let numero = parseInt(prompt("Introduce un número"));
let resultado = 1;

for (let i = 1; i <= numero; i++) {
  resultado = resultado * i;
}

document.write("El factorial de " + numero + " es " + resultado);`,
    trampa: "5! = 120. Si empiezas resultado en 0, todo da 0."
  },
  {
    ud: 2, amp: false, titulo: "Elegir ciudad con switch",
    enunciado: "Al pulsar un botón, pide el nombre de una ciudad. Con switch muestra un mensaje distinto para Zaragoza, Barcelona y Madrid, y otro mensaje si es cualquier otra.",
    pasos: [
      "Crea un botón con onclick que llame a una función.",
      "Dentro, pide la ciudad con prompt().",
      "En el switch pon un case por ciudad, cada uno con su alert y su break.",
      "El default recoge cualquier otra ciudad."
    ],
    codigo: String.raw`<button onclick="elegirCiudad()">Elegir ciudad</button>

<script>
  function elegirCiudad() {
    let ciudad = prompt("Introduce una ciudad");
    switch (ciudad) {
      case "Zaragoza":
        alert("Has elegido Zaragoza, ¡la tierra de los maños!");
        break;
      case "Barcelona":
        alert("Has elegido Barcelona");
        break;
      case "Madrid":
        alert("Has elegido Madrid");
        break;
      default:
        alert("Esa ciudad no está en la lista");
    }
  }
</script>`,
    trampa: "Sin break se ejecutan también los case de debajo."
  },
  {
    ud: 2, amp: false, titulo: "Mayúsculas, minúsculas o ambas",
    enunciado: "Con OVNI = \"OBJETO VOLADOR NO IDENTIFICADO\" e Info = \"En un lugar de la mancha\", comprueba si cada cadena está en minúsculas, mayúsculas o ambas. Usa toUpperCase() y toLowerCase(). Después, hazlo con un texto del usuario.",
    pasos: [
      "Si texto === texto.toUpperCase(), ya estaba todo en mayúsculas.",
      "Si texto === texto.toLowerCase(), estaba todo en minúsculas.",
      "Si no se cumple ninguna, mezcla las dos.",
      "Mételo en una función para reutilizarlo con el texto que escriba el usuario."
    ],
    codigo: String.raw`function tipoDeLetra(texto) {
  if (texto === texto.toUpperCase()) {
    return "mayúsculas";
  } else if (texto === texto.toLowerCase()) {
    return "minúsculas";
  } else {
    return "ambas";
  }
}

let OVNI = "OBJETO VOLADOR NO IDENTIFICADO";
let Info = "En un lugar de la mancha";
console.log(OVNI + " → " + tipoDeLetra(OVNI));   // mayúsculas
console.log(Info + " → " + tipoDeLetra(Info));   // ambas

let usuario = prompt("Escribe un texto");
console.log(usuario + " → " + tipoDeLetra(usuario));`,
    trampa: "\"En un lugar…\" tiene la E mayúscula y el resto en minúsculas: es «ambas»."
  },
  {
    ud: 2, amp: false, titulo: "Valor máximo, mínimo e infinito",
    enunciado: "Muestra por consola el máximo y el valor más cercano a cero posibles en JavaScript. Después, muestra un valor infinito.",
    pasos: [
      "Number.MAX_VALUE es el máximo y Number.MIN_VALUE el más cercano a cero.",
      "Si te pasas del máximo (por ejemplo multiplicándolo por 2) obtienes Infinity.",
      "También existen Number.POSITIVE_INFINITY y Number.NEGATIVE_INFINITY."
    ],
    codigo: String.raw`console.log("Máximo: " + Number.MAX_VALUE);
console.log("Más cercano a cero: " + Number.MIN_VALUE);
console.log("Infinito: " + Number.MAX_VALUE * 2);
console.log("Infinito: " + Number.POSITIVE_INFINITY);`,
    trampa: ""
  },
  {
    ud: 3, amp: false, titulo: "Fecha actual y hora si es octubre",
    enunciado: "Muestra la fecha actual, saca por consola el mes actual y, si es octubre, muestra la hora actual.",
    pasos: [
      "Crea la fecha con new Date().",
      "getMonth() empieza en 0, así que súmale 1 para tener el mes «humano».",
      "Compara con 10 (octubre) y, si coincide, muestra la fecha completa o la hora."
    ],
    codigo: String.raw`let fecha_actual = new Date();
let mes = fecha_actual.getMonth() + 1;
console.log(mes);

if (mes == 10) {
  document.write(fecha_actual.toLocaleTimeString());
} else {
  console.log("Como no es octubre no hago nada");
}`,
    trampa: "Sin el + 1, octubre sería 9."
  },
  {
    ud: 3, amp: false, titulo: "Reloj digital con setInterval",
    enunciado: "Muestra un reloj que se actualice cada segundo, con horas, minutos y segundos.",
    pasos: [
      "Pon en el HTML un elemento vacío con id, por ejemplo <p id=\"demo\"></p>.",
      "Crea una función que haga new Date() y escriba toLocaleTimeString() en ese elemento con innerHTML.",
      "Llama a esa función cada 1000 ms con setInterval(funcion, 1000)."
    ],
    codigo: String.raw`<p id="demo"></p>

<script>
  let myVar = setInterval(myTimer, 1000);

  function myTimer() {
    let d = new Date();
    document.getElementById("demo").innerHTML = d.toLocaleTimeString();
  }
</script>`,
    trampa: "setInterval recibe el nombre de la función (myTimer), sin paréntesis. Para pararlo: clearInterval(myVar)."
  },
  {
    ud: 3, amp: false, titulo: "Métodos de String sobre una frase",
    enunciado: "Con \"Numero de letras de esta cadena\": calcula la longitud, el carácter en la posición 5, la posición de la primera «s», la de la última «e» y cambia «letras» por «caracteres».",
    pasos: [
      "Longitud: texto.length.",
      "Carácter en una posición: texto.charAt(5) (se cuenta desde 0).",
      "Primera aparición: texto.indexOf(\"s\"); última: texto.lastIndexOf(\"e\").",
      "Reemplazar: texto.replace(\"letras\", \"caracteres\")."
    ],
    codigo: String.raw`let texto = "Numero de letras de esta cadena";

document.write("Longitud: " + texto.length + "<br>");
document.write("Carácter en la posición 5: " + texto.charAt(5) + "<br>");
document.write("Primera s: " + texto.indexOf("s") + "<br>");
document.write("Última e: " + texto.lastIndexOf("e") + "<br>");
document.write(texto.replace("letras", "caracteres"));`,
    trampa: "La solución del PDF tiene erratas (busca \"r\" en lugar de \"s\" y le falta un paréntesis). Esta es la versión correcta."
  },
  {
    ud: 3, amp: false, titulo: "Métodos de Array",
    enunciado: "Con el array (\"uno\", \"dos\", \"tres\", \"cuatro\", \"cinco\", \"seis\"): longitud, posición 4, quitar el último y mostrarlo, e insertar dos elementos.",
    pasos: [
      "Longitud: arr.length.",
      "Elemento de una posición: arr[4] (empieza en 0, así que arr[4] es \"cinco\").",
      "pop() quita el último y lo devuelve: muéstralo directamente.",
      "push(\"a\", \"b\") añade al final y devuelve la nueva longitud."
    ],
    codigo: String.raw`let arr = ["uno", "dos", "tres", "cuatro", "cinco", "seis"];

document.write(arr.length + "<br>");        // 6
document.write(arr[4] + "<br>");            // cinco
document.write(arr.pop() + "<br>");         // seis
document.write(arr.push("nuevo1", "nuevo2")); // 7`,
    trampa: "El enunciado pide insertarlos al principio, pero la solución del PDF usa push (que añade al final)."
  },
  {
    ud: 3, amp: false, titulo: "Contador de clicks (localStorage y sessionStorage)",
    enunciado: "Cuenta las veces que se pulsa un botón y que el número quede guardado. Después, haz que vuelva a 0 al cerrar la sesión del navegador.",
    pasos: [
      "Comprueba que el navegador lo soporta: typeof(Storage) !== \"undefined\".",
      "Si ya existe localStorage.clickcount, súmale 1 convirtiéndolo con Number() (se guarda como texto). Si no existe, empieza en 1.",
      "Escribe el resultado con getElementById(...).innerHTML.",
      "Para que se borre al cerrar el navegador, cambia localStorage por sessionStorage."
    ],
    codigo: String.raw`<button onclick="clicador()" type="button">Haz click</button>
<div id="result"></div>

<script>
  function clicador() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
      } else {
        localStorage.clickcount = 1;
      }
      document.getElementById("result").innerHTML =
        "Has hecho click " + localStorage.clickcount + " veces";
    } else {
      document.getElementById("result").innerHTML = "Tu navegador no soporta almacenamiento web";
    }
  }
</script>`,
    trampa: "Sin Number(), \"1\" + 1 daría \"11\"."
  },
  {
    ud: 3, amp: false, titulo: "Botón para volver atrás",
    enunciado: "Crea un botón que vaya a la pantalla anterior de navegación.",
    pasos: [
      "Usa un botón con onclick.",
      "El método window.history.back() carga la página anterior del historial."
    ],
    codigo: String.raw`<button onclick="window.history.back()">Atrás</button>
<button onclick="window.history.forward()">Adelante</button>`,
    trampa: ""
  },
  {
    ud: 3, amp: false, titulo: "Pop-up centrado",
    enunciado: "Con un enlace, abre un pop-up con una página web y céntralo en la pantalla.",
    pasos: [
      "window.open(\"url\", \"nombre de la ventana\", \"tamaño y posición\") abre la ventana.",
      "Para centrarla: izquierda = (screen.width - ancho) / 2 y arriba = (screen.height - alto) / 2.",
      "Pasa esos valores en el tercer parámetro: \"width=…,height=…,left=…,top=…\".",
      "En el enlace usa onclick y devuelve false para que no siga el href."
    ],
    codigo: String.raw`<a href="#" onclick="abrirPopup(); return false;">Abrir pop-up</a>

<script>
  function abrirPopup() {
    let ancho = 600;
    let alto = 400;
    let izquierda = (screen.width - ancho) / 2;
    let arriba = (screen.height - alto) / 2;
    window.open("https://www.w3schools.com", "popup",
      "width=" + ancho + ",height=" + alto + ",left=" + izquierda + ",top=" + arriba);
  }
</script>`,
    trampa: "En la ayuda del PDF pone screen.heigh: la propiedad correcta es screen.height."
  },
  {
    ud: 3, amp: false, titulo: "Del 1 al 500: múltiplos de 3 y cuántos no son primos",
    enunciado: "Recorre del 1 al 500. Muestra solo los múltiplos de 3 y cuenta cuántos números no son primos.",
    pasos: [
      "Un for de i = 1 a i <= 500.",
      "Si i % 3 === 0 es múltiplo de 3: muéstralo.",
      "Para saber si es primo, prueba a dividir entre 2, 3, 4… hasta i - 1: si alguna división da resto 0, no es primo. El 1 tampoco es primo.",
      "Lleva un contador de no primos y muéstralo al final."
    ],
    codigo: String.raw`let noPrimos = 0;

for (let i = 1; i <= 500; i++) {
  if (i % 3 === 0) {
    document.write(i + " ");
  }

  let esPrimo = i > 1;
  for (let d = 2; d < i; d++) {
    if (i % d === 0) {
      esPrimo = false;
      break;
    }
  }
  if (!esPrimo) {
    noPrimos++;
  }
}

document.write("<br>Números que no son primos: " + noPrimos);`,
    trampa: "Del 1 al 500 hay 95 primos, así que salen 405 no primos (contando el 1)."
  },
  {
    ud: 3, amp: false, titulo: "Número menor y mayor de un array",
    enunciado: "Mete 10 números enteros en un array y muestra el menor y el mayor comprobando cada posición. Ampliación: pide los 10 números por teclado.",
    pasos: [
      "Empieza suponiendo que el primero es a la vez el menor y el mayor.",
      "Recorre el array desde la posición 1 y compara: si es más pequeño que el menor, actualiza el menor; si es más grande que el mayor, actualiza el mayor.",
      "Para la ampliación, rellena el array con un for, prompt() y push()."
    ],
    codigo: String.raw`let numeros = [12, 5, 33, -4, 18, 0, 7, 99, 21, 3];
// Ampliación:
// let numeros = [];
// for (let i = 0; i < 10; i++) { numeros.push(parseInt(prompt("Número " + (i + 1)))); }

let menor = numeros[0];
let mayor = numeros[0];

for (let i = 1; i < numeros.length; i++) {
  if (numeros[i] < menor) { menor = numeros[i]; }
  if (numeros[i] > mayor) { mayor = numeros[i]; }
}

document.write("Menor: " + menor + "<br>Mayor: " + mayor);`,
    trampa: "No empieces menor en 0: si todos los números son positivos, el 0 nunca se superaría."
  },
  {
    ud: 3, amp: false, titulo: "Talla de ropa",
    enunciado: "Introduce una talla europea (XXL, XL, L, M, S, XS, XXS) y muestra si es Grande, Mediana o Pequeña.",
    pasos: [
      "Pide la talla y pásala a mayúsculas con toUpperCase() para aceptar «xl» también.",
      "Usa switch agrupando varios case seguidos sin break: case \"XXL\": case \"XL\": case \"L\": → Grande.",
      "M → Mediana; S, XS y XXS → Pequeña; default → talla no válida."
    ],
    codigo: String.raw`let talla = prompt("Introduce tu talla (XXL, XL, L, M, S, XS, XXS)").toUpperCase();

switch (talla) {
  case "XXL":
  case "XL":
  case "L":
    alert("Grande");
    break;
  case "M":
    alert("Mediana");
    break;
  case "S":
  case "XS":
  case "XXS":
    alert("Pequeña");
    break;
  default:
    alert("Talla no válida");
}`,
    trampa: "La ayuda del PDF pone Mediana: {S}; es una errata, la mediana es la M."
  },
  {
    ud: 3, amp: false, titulo: "Longitud de la circunferencia",
    enunciado: "Calcula la longitud de la circunferencia a partir del radio usando objetos propios de JavaScript.",
    pasos: [
      "La fórmula es L = 2 · π · radio.",
      "π está en Math.PI.",
      "Pide el radio y conviértelo a número."
    ],
    codigo: String.raw`let radio = parseFloat(prompt("Introduce el radio"));
let L = 2 * Math.PI * radio;
alert("La longitud es " + L.toFixed(2));`,
    trampa: ""
  },
  {
    ud: 3, amp: false, titulo: "Euromillones aleatorio",
    enunciado: "Genera 5 números del 1 al 50 y 2 estrellas del 1 al 10, de forma aleatoria y sin repetir.",
    pasos: [
      "Math.random() da un número entre 0 y 1; multiplicado por 50 da entre 0 y 50.",
      "Math.ceil() lo sube al siguiente entero: queda entre 1 y 50.",
      "Repite con un while hasta tener 5 números. Antes de añadir con push(), comprueba que no está ya en el array (recórrelo con for…of).",
      "Haz lo mismo para las 2 estrellas, con 10 en vez de 50."
    ],
    codigo: String.raw`function sinRepetir(cuantos, maximo) {
  let lista = [];
  while (lista.length < cuantos) {
    let n = Math.ceil(Math.random() * maximo);
    let repetido = false;
    for (let x of lista) {
      if (x === n) { repetido = true; }
    }
    if (!repetido) {
      lista.push(n);
    }
  }
  return lista;
}

document.write("Números: " + sinRepetir(5, 50) + "<br>");
document.write("Estrellas: " + sinRepetir(2, 10));`,
    trampa: "Con Math.round(Math.random() * 50) podría salir 0, que no es válido."
  },
  {
    ud: 3, amp: false, titulo: "Coordenadas de una matriz",
    enunciado: "Introduce el número de filas (x) y de columnas (y) y muestra todas las posiciones (x, y). Ejemplo 5x3: (1,1) (1,2) … (5,3).",
    pasos: [
      "Pide x e y con prompt() y parseInt().",
      "Un for de fila = 1 a x y, dentro, otro for de col = 1 a y.",
      "En el bucle de dentro escribe \"(\" + fila + \",\" + col + \") \"."
    ],
    codigo: String.raw`let x = parseInt(prompt("Número de filas"));
let y = parseInt(prompt("Número de columnas"));

for (let fila = 1; fila <= x; fila++) {
  for (let col = 1; col <= y; col++) {
    document.write("(" + fila + "," + col + ") ");
  }
  document.write("<br>");
}`,
    trampa: "Una matriz 5x3 tiene 5 · 3 = 15 posiciones."
  },
  {
    ud: 3, amp: false, titulo: "«Seguir leyendo» una noticia",
    enunciado: "Al pulsar un botón, inserta el resto del texto de una noticia en un párrafo vacío.",
    pasos: [
      "Pon un párrafo vacío con id (por ejemplo demo1) debajo del texto visible.",
      "Crea una función que haga document.getElementById(\"demo1\").innerHTML = \"…resto del texto…\".",
      "Llama a la función desde el onclick del botón. Con <br> dentro del texto haces saltos de línea."
    ],
    codigo: String.raw`<p>En el instituto llevamos varios años colaborando con Donantes de Sangre...</p>
<p id="demo1"></p>
<button type="button" onclick="myFunction()">Seguir leyendo</button>

<script>
  function myFunction() {
    document.getElementById("demo1").innerHTML =
      "...la siguiente donación será:<br>Fecha: martes 3 de octubre<br>Lugar: Biblioteca del IES";
  }
</script>`,
    trampa: ""
  }
];
