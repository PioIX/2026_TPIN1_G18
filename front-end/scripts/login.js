// URL base del servidor backend
const API = "http://localhost:4000";

// Función para manejar el inicio de sesión
function handleLogin() {
    var email = document.getElementById("email").value; // Obtener email del input
    var password = document.getElementById("password").value; // Obtener contraseña del input
    var mensajeLogin = document.getElementById("mensajeLogin"); // Elemento para mensajes

    // Limpiar mensajes anteriores
    mensajeLogin.className = "";
    mensajeLogin.textContent = "";

    // Validar campos obligatorios y longitud de contraseña
    if (email.trim().length === 0 || password.trim().length === 0) {
        mensajeLogin.textContent = "Por favor, complete todos los campos";
        mensajeLogin.className = "text-danger";
        return;
    }
    if (password.trim().length < 8) {
        mensajeLogin.textContent = "La contraseña debe tener al menos 8 caracteres";
        mensajeLogin.className = "text-danger";
        return;
    }

    // Enviar datos al servidor para validar login
    fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(function(respuesta) { return respuesta.json(); }) // Convertir respuesta a JSON
    .then(function(data) {
        if (data.success) {
            // Guardar datos del usuario en el almacenamiento local
            localStorage.setItem("usuarioId", data.id);
            localStorage.setItem("usuarioNombre", data.nombre);
            localStorage.setItem("esAdmin", data.esAdmin);
            // Redirigir a la página correspondiente según rol
            if (data.esAdmin) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "inicio.html";
            }
        } else {
            mensajeLogin.textContent = "Email y/o contraseña incorrectos";
            mensajeLogin.className = "text-danger";
        }
    })
    .catch(function(error) {
        mensajeLogin.textContent = "Error al conectar con el servidor";
        mensajeLogin.className = "text-danger";
    });
}
