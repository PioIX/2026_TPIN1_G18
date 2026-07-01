function cerrarSesion() {
    var confirmado = confirm("Estas seguro de que queres cerrar sesion?");
    if (confirmado) {
        window.location.href = "index.html";
    }
}