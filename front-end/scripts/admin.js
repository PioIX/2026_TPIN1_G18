// URL base del servidor backend
const API = "http://localhost:4000";

// Verificar si el usuario es admin, si no, redirigir
if (localStorage.getItem("esAdmin") !== "true") {
    window.location.href = "inicio.html";
}

// Función para cargar y mostrar todas las preguntas
function cargarPreguntas() {
    fetch(API + "/preguntas")
    .then(function(r) { return r.json(); })
    .then(function(preguntas) {
        var tabla = document.getElementById("tablaPreguntas");
        tabla.innerHTML = "";
        for (var i = 0; i < preguntas.length; i++) {
            var p = preguntas[i];
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
        }
    });
}

// Función para agregar una nueva pregunta
function agregarPregunta() {
    var letra = document.getElementById("nuevaLetra").value;
    var pregunta = document.getElementById("nuevaPregunta").value;
    var respuesta = document.getElementById("nuevaRespuesta").value;
    var dificultad = document.getElementById("nuevaDificultad").value;

    // Validar campos obligatorios
    if (letra == "" || pregunta == "" || respuesta == "") {
        alert("Completa todos los campos");
        return;
    }

    // Enviar datos al servidor
    fetch(API + "/preguntas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letra: letra, pregunta: pregunta, respuesta: respuesta, dificultad: dificultad })
    })
    .then(function(r) { return r.text(); })
    .then(function(texto) {
        alert(texto);
        // Limpiar campos
        document.getElementById("nuevaLetra").value = "";
        document.getElementById("nuevaPregunta").value = "";
        document.getElementById("nuevaRespuesta").value = "";
        cargarPreguntas(); // Recargar la lista
    });
}

// Función para editar una pregunta
function editarPregunta(id, letraActual, preguntaActual, respuestaActual, dificultadActual) {
    var nuevaPregunta = prompt("Editar pregunta:", preguntaActual);
    if (nuevaPregunta === null) return;
    var nuevaRespuesta = prompt("Editar respuesta:", respuestaActual);
    if (nuevaRespuesta === null) return;

    // Enviar actualización al servidor
    fetch(API + "/preguntas/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letra: letraActual, pregunta: nuevaPregunta, respuesta: nuevaRespuesta, dificultad: dificultadActual })
    })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarPreguntas(); });
}

// Función para eliminar una pregunta
function eliminarPregunta(id) {
    if (!confirm("Eliminar esta pregunta?")) return;
    fetch(API + "/preguntas/" + id, { method: "DELETE" })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarPreguntas(); });
}

// Función para cargar y mostrar la lista de usuarios
function cargarUsuarios() {
    fetch(API + "/usuarios")
    .then(function(r) { return r.json(); })
    .then(function(usuarios) {
        var tabla = document.getElementById("tablaUsuarios");
        tabla.innerHTML = "";
        for (var i = 0; i < usuarios.length; i++) {
            var u = usuarios[i];
            var esAdminTexto = u.es_admin ? "Si" : "No";
            tabla.innerHTML += "<tr>" +
                "<td>" + u.id + "</td>" +
                "<td>" + u.nombre + "</td>" +
                "<td>" + u.email + "</td>" +
                "<td>" + esAdminTexto + "</td>" +
                "<td><button class='btn btn-sm btn-danger' onclick='eliminarUsuario(" + u.id + ")'>Eliminar</button></td>" +
            "</tr>";
        }
    });
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
    if (!confirm("Eliminar este usuario?")) return;
    fetch(API + "/usuarios/" + id, { method: "DELETE" })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarUsuarios(); });
}

// Función para cargar y mostrar el historial de partidas
function cargarPuntajes() {
    fetch(API + "/partidas")
    .then(function(r) { return r.json(); })
    .then(function(partidas) {
        var tabla = document.getElementById("tablaPuntajes");
        tabla.innerHTML = "";
        for (var i = 0; i < partidas.length; i++) {
            var p = partidas[i];
            var fechaFormateada = formatearFecha(p.fecha_creacion);
            tabla.innerHTML += "<tr>" +
                "<td>" + p.nombre + "</td>" +
                "<td>" + p.puntuacion + "</td>" +
                "<td>" + fechaFormateada + "</td>" +
                "<td><button class='btn btn-sm btn-danger' onclick='eliminarPuntaje(" + p.id + ")'>Eliminar</button></td>" +
            "</tr>";
        }
    });
}

// Función para formatear la fecha (quitar hora si la hay)
function formatearFecha(fecha) {
    var fechaStr = String(fecha);
    var partes = fechaStr.split("T");
    if (partes.length > 1) return partes[0];
    partes = fechaStr.split(" ");
    if (partes.length > 1) return partes[0];
    return fechaStr;
}

// Función para eliminar un registro de partida
function eliminarPuntaje(id) {
    if (!confirm("Eliminar este puntaje?")) return;
    fetch(API + "/partidas/" + id, { method: "DELETE" })
    .then(function(r) { return r.text(); })
    .then(function(texto) { alert(texto); cargarPuntajes(); });
}

// Cargar todas las listas cuando se carga la página
cargarPreguntas();
cargarUsuarios();
cargarPuntajes();
