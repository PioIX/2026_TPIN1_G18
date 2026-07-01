const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const contenedor = document.getElementById("rosco-circulo");
const radio = 130;
const centro = 160;
let activa = 0;
let aciertos = 0;
const nodos = [];

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
    nodo.onclick = function () { activarLetra(i); };

    contenedor.appendChild(nodo);
    nodos.push(nodo);
  });
  activarLetra(0);
}

function activarLetra(i) {
  nodos[activa].classList.remove("activa");
  activa = i;
  nodos[activa].classList.add("activa");
  document.getElementById("rosco-descripcion").textContent = "Descripcion de prueba para la letra " + letras[i];
  document.getElementById("rosco-pista").textContent = "Pista de prueba";
  document.getElementById("rosco-respuesta").value = "";
}

function pasapalabra() {
  activarLetra((activa + 1) % letras.length);
}

function comprobarRespuesta() {
  nodos[activa].classList.add("correcta");
  aciertos = Math.min(aciertos + 1, 27);
  document.getElementById("rosco-aciertos").textContent = aciertos;
  pasapalabra();
}

crearRosco();