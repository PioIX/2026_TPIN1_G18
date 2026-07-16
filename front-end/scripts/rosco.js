const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const contenedor = document.getElementById("rosco-circulo");
const radio = 130;
const centro = 160;
let activa = 0;
let aciertos = 0;
let preguntasPorLetra = {};
let estados = {};
const nodos = [];
let tiempoRestante = 5 * 60;
let timerInterval = null;
let juegoTerminado = false;

function crearRosco() {
  letras.forEach(function (letra, i) {
    const angulo = (i / letras.length) * 2 * Math.PI - Math.PI / 2;
    const x = centro + radio * Math.cos(angulo) - 16;
    const y = centro + radio * Math.sin(angulo) - 16;

    const nodo = document.createElement("div");
    nodo.textContent = letra;
    nodo.className = "rosco-letra";
    nodo.style.left = x + "px";
    nodo.style.top = y + "px";
    nodo.onclick = function () { if (!juegoTerminado) activarLetra(i); };

    contenedor.appendChild(nodo);
    nodos.push(nodo);
    estados[letra] = "pendiente";
  });
}

function empezarJuego(dificultad) {
 document.getElementById("selector-dificultad").style.display = "none";
 document.getElementById("juego-container").style.display = "block";

 if (dificultad === "Facil") tiempoRestante = 6 * 60;
 else if (dificultad === "Medio") tiempoRestante = 4 * 60;
 else if (dificultad === "Dificil") tiempoRestante = 2 * 60;

 cargarPreguntas(dificultad);
}
function cargarPreguntas(dificultad) {
  fetch("http://localhost:4000/preguntas?dificultad=" + dificultad)
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (datos) {
      var porLetra = {};
      datos.forEach(function (fila) {
        var letra = fila.letra.trim().toUpperCase();
        if (!porLetra[letra]) porLetra[letra] = [];
        porLetra[letra].push(fila);
      });

      Object.keys(porLetra).forEach(function (letra) {
        var opciones = porLetra[letra];
        var elegida = opciones[Math.floor(Math.random() * opciones.length)];
        preguntasPorLetra[letra] = elegida;
      });

      var primeraConDatos = siguienteConDatosDesde(-1);
      if (primeraConDatos === null) {
        document.getElementById("rosco-descripcion").textContent = "No hay preguntas cargadas para esta dificultad.";
        return;
      }
      activarLetra(primeraConDatos);
      iniciarTimer();
    });
}

function activarLetra(i) {
 nodos[activa].classList.remove("activa");
 activa = i;
 nodos[activa].classList.add("activa");
 const letra = letras[i];
 const datos = preguntasPorLetra[letra];
 document.getElementById("rosco-descripcion").textContent =
 datos ? datos.pregunta : "No hay pregunta cargada para esta letra";
 document.getElementById("rosco-respuesta").value = "";

 if (datos) {
 const primeraLetra = datos.respuesta.trim().charAt(0).toUpperCase();
 document.getElementById("rosco-pista").textContent =
 primeraLetra === letra
 ? "Empieza por la letra \"" + letra + "\""
 : "Contiene la letra \"" + letra + "\"";
 } else {
 document.getElementById("rosco-pista").textContent = "...";
 }
}

function siguienteConDatosDesde(desde) {
 for (let paso = 1; paso <= letras.length; paso++) {
 const i = (desde + paso) % letras.length;
 const letra = letras[i];
 if ((estados[letra] === "pendiente" || estados[letra] === "pasada") && preguntasPorLetra[letra]) return i;
 }
 return null;
}

function pasapalabra() {
 const letra = letras[activa];
 if (estados[letra] === "pendiente") {
 estados[letra] = "pasada";
 nodos[activa].classList.add("pasada");
 }
 const siguiente = siguienteConDatosDesde(activa);
 if (siguiente !== null) activarLetra(siguiente);
}

function comprobarRespuesta() {
 const letra = letras[activa];
 const datos = preguntasPorLetra[letra];
 const respuestaUsuario =
  document.getElementById("rosco-respuesta").value.trim().toLowerCase();

 if (datos) {
  const esCorrecta = respuestaUsuario === datos.respuesta.trim().toLowerCase();

  // saca cualquier color previo (pasada) antes de aplicar el nuevo
  nodos[activa].classList.remove("pasada", "correcta", "incorrecta");

  if (esCorrecta) {
   nodos[activa].classList.add("correcta");
   estados[letra] = "correcta";
   aciertos++;
  } else {
   nodos[activa].classList.add("incorrecta");
   estados[letra] = "incorrecta";
  }
  document.getElementById("rosco-aciertos").textContent = aciertos;
 }

 const siguiente = siguienteConDatosDesde(activa);
 if (siguiente !== null) {
  activarLetra(siguiente);
 } else {
  finalizarJuego();
 }
}

function iniciarTimer() {
  actualizarTimer();
  timerInterval = setInterval(function () {
    tiempoRestante--;
    actualizarTimer();
    if (tiempoRestante <= 0) finalizarJuego();
  }, 1000);
}

function actualizarTimer() {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  document.getElementById("rosco-timer").textContent =
    minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
}

function finalizarJuego() {
  if (juegoTerminado) return;
  juegoTerminado = true;
  clearInterval(timerInterval);
  document.getElementById("rosco-respuesta").disabled = true;

  fetch("http://localhost:4000/partidas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario: localStorage.getItem("usuarioId"),
      puntuacion: aciertos
    })
  })
  .then(function () {
    localStorage.setItem("ultimoPuntaje", aciertos);
    window.location.href = "resultado.html";
  });
}

crearRosco();