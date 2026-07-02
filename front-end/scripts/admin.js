const API = "http://localhost:4000";

if (localStorage.getItem("esAdmin") !== "true") {
  window.location.href = "inicio.html";
}

function cargarPreguntas() {
  fetch(API + "/preguntas")
    .then(function(r) { return r.json(); })
    .then(function(preguntas) {
      var tabla = document.getElementById("tablaPreguntas");
      tabla.innerHTML = "";
      preguntas.forEach(function(p) {
        tabla.innerHTML += "<tr>" +
          "<td>" + p.letra + "</td>" +
          "<td>" + p.pregunta + "</td>" +
          "<td>" + p.respuesta + "</td>" +
          "<td>" + p.dificultad + "</td>" +
          "<td>" +
            "<button class='btn btn-sm btn-warning me-1' onclick=\"editarPregunta(" + p.id + ",'" + p.letra + "','" + p.pregunta + "','" + p.respuesta + "','" + p.dificultad + "')\">Editar</button>" +
            "<button class='btn btn-sm btn-danger' onclick='eliminarPregunta(" + p.id + ")'>Eliminar</button>" +
          "</td>" +
          "</tr>";
      });
    });
}

function agregarPregunta() {
  var letra = document.getElementById("nuevaLetra").value;
  var pregunta = document.getElementById("nuevaPregunta").value;
  var respuesta = document.getElementById("nuevaRespuesta").value;
  var dificultad = document.getElementById("nuevaDificultad").value;

  if (letra == "" || pregunta == "" || respuesta == "") {
    alert("Completa todos los campos");
    return;
  }

  fetch(API + "/preguntas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ letra: letra, pregunta: pregunta, respuesta: respuesta, dificultad: dificultad })
  })
  .then(function(r) { return r.text(); })
  .then(function(texto) {
    alert(texto);
    document.getElementById("nuevaLetra").value = "";
    document.getElementById("nuevaPregunta").value = "";
    document.getElementById("nuevaRespuesta").value = "";
    cargarPreguntas();
  });
}

function editarPregunta(id, letraActual, preguntaActual, respuestaActual, dificultadActual) {
  var nuevaPregunta = prompt("Editar pregunta:", preguntaActual);
  if (nuevaPregunta === null) return;
  var nuevaRespuesta = prompt("Editar respuesta:", respuestaActual);
  if (nuevaRespuesta === null) return;

  fetch(API + "/preguntas/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ letra: letraActual, pregunta: nuevaPregunta, respuesta: nuevaRespuesta, dificultad: dificultadActual })
  })
  .then(function(r) { return r.text(); })
  .then(function(texto) { alert(texto); cargarPreguntas(); });
}

function eliminarPregunta(id) {
  if (!confirm("Eliminar esta pregunta?")) return;
  fetch(API + "/preguntas/" + id, { method: "DELETE" })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarPreguntas(); });
}

function cargarUsuarios() {
  fetch(API + "/usuarios")
    .then(function(r) { return r.json(); })
    .then(function(usuarios) {
      var tabla = document.getElementById("tablaUsuarios");
      tabla.innerHTML = "";
      usuarios.forEach(function(u) {
        tabla.innerHTML += "<tr>" +
          "<td>" + u.id + "</td>" +
          "<td>" + u.nombre + "</td>" +
          "<td>" + u.email + "</td>" +
          "<td>" + (u.es_admin ? "Si" : "No") + "</td>" +
          "<td><button class='btn btn-sm btn-danger' onclick='eliminarUsuario(" + u.id + ")'>Eliminar</button></td>" +
          "</tr>";
      });
    });
}

function eliminarUsuario(id) {
  if (!confirm("Eliminar este usuario?")) return;
  fetch(API + "/usuarios/" + id, { method: "DELETE" })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarUsuarios(); });
}

function cargarPuntajes() {
  fetch(API + "/partidas")
    .then(function(r) { return r.json(); })
    .then(function(partidas) {
      var tabla = document.getElementById("tablaPuntajes");
      tabla.innerHTML = "";
      partidas.forEach(function(p) {
        tabla.innerHTML += "<tr>" +
          "<td>" + p.nombre + "</td>" +
          "<td>" + p.puntuacion + "</td>" +
          "<td>" + p.fecha_creacion + "</td>" +
          "<td><button class='btn btn-sm btn-danger' onclick='eliminarPuntaje(" + p.id + ")'>Eliminar</button></td>" +
          "</tr>";
      });
    });
}

function eliminarPuntaje(id) {
  if (!confirm("Eliminar este puntaje?")) return;
  fetch(API + "/partidas/" + id, { method: "DELETE" })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarPuntajes(); });
}

cargarPreguntas();
cargarUsuarios();
cargarPuntajes();
