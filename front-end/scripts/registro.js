// URL base del servidor backend
const API = "http://localhost:4000";

// Función para mostrar un error debajo de un campo
function mostrarError(campo, mensaje) {
    var errorElement = document.getElementById("error-" + campo);
    errorElement.textContent = mensaje;
    errorElement.style.display = "block";
}

// Función para ocultar el error de un campo
function ocultarError(campo) {
    var errorElement = document.getElementById("error-" + campo);
    errorElement.style.display = "none";
}

// Función para manejar el registro de usuarios
function handleRegistro() {
    var dni = document.getElementById("dni").value; // Obtener DNI
    var nombre = document.getElementById("nombre").value; // Obtener nombre
    var email = document.getElementById("email").value; // Obtener email
    var password = document.getElementById("password").value; // Obtener contraseña
    var mensajeRegistro = document.getElementById("mensajeRegistro"); // Elemento para mensajes generales

    // Ocultar todos los errores anteriores
    ocultarError("dni");
    ocultarError("nombre");
    ocultarError("email");
    ocultarError("password");
    mensajeRegistro.textContent = "";
    mensajeRegistro.className = "";

    var hayError = false; // Bandera para saber si hubo algún error

    // Validar DNI
    if (dni.trim().length === 0) {
        mostrarError("dni", "El DNI es obligatorio");
        hayError = true;
    } else if (dni.trim().length < 7 || dni.trim().length > 8) {
        mostrarError("dni", "El DNI debe tener entre 7 y 8 caracteres");
        hayError = true;
    }

    // Validar nombre
    if (nombre.trim().length === 0) {
        mostrarError("nombre", "El nombre es obligatorio");
        hayError = true;
    }

    // Validar email
    if (email.trim().length === 0) {
        mostrarError("email", "El email es obligatorio");
        hayError = true;
    }

    // Validar contraseña
    if (password.trim().length === 0) {
        mostrarError("password", "La contraseña es obligatoria");
        hayError = true;
    } else if (password.trim().length < 8) {
        mostrarError("password", "La contraseña debe tener al menos 8 caracteres");
        hayError = true;
    }

    if (hayError) {
        return; // Si hubo errores, no continuar
    }

    // Enviar datos al servidor para registrar el usuario
    fetch(API + "/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: dni, nombre: nombre, email: email, password: password })
    })
    .then(function(respuesta) { return respuesta.text(); }) // Convertir respuesta a texto
    .then(function(texto) {
        if (texto === "Usuario registrado correctamente") {
            mensajeRegistro.className = "text-success";
            mensajeRegistro.textContent = texto + ". Redirigiendo al login...";
            // Redirigir a login después de 1.5 segundos
            setTimeout(function() {
                window.location.href = "index.html";
            }, 1500);
        } else {
            // Mostrar errores específicos según la respuesta del servidor
            if (texto.indexOf("DNI") !== -1) {
                mostrarError("dni", "DNI inválido: ya lo tiene otro usuario");
            }
            if (texto.indexOf("email") !== -1) {
                mostrarError("email", "Email inválido: ya lo tiene otro usuario");
            }
            if (texto.indexOf("DNI") === -1 && texto.indexOf("email") === -1) {
                mensajeRegistro.textContent = texto;
                mensajeRegistro.className = "text-danger";
            }
        }
    })
    .catch(function(error) {
        mensajeRegistro.textContent = "Error al conectar con el servidor";
        mensajeRegistro.className = "text-danger";
    });
}
