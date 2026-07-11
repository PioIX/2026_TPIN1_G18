// Verificar si el usuario está autenticado, si no, redirigir a login
if (!localStorage.getItem("usuarioNombre")) {
    window.location.href = "index.html";
}

// Mostrar mensaje de bienvenida con el nombre del usuario
var elementoBienvenida = document.getElementById("bienvenida");
if (elementoBienvenida) {
    elementoBienvenida.textContent = "¡Bienvenido/a, " + localStorage.getItem("usuarioNombre") + "!";
}

// Función para cerrar sesión
function cerrarSesion() {
    var confirmado = confirm("Estas seguro de que queres cerrar sesion?");
    if (confirmado) {
        // Eliminar datos del usuario del almacenamiento local
        localStorage.removeItem("usuarioNombre");
        localStorage.removeItem("esAdmin");
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html"; // Redirigir a login
    }
}
