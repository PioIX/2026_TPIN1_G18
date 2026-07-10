// Función para inicializar el modo oscuro
function inicializarModoOscuro() {
    var boton = document.getElementById("toggle-dark-mode"); // Botón para cambiar modo
    if (!boton) return; // Si no hay botón, no hacer nada

    // Cargar la preferencia del usuario desde localStorage
    if (localStorage.getItem("modoOscuro") === "activado") {
        document.body.classList.add("dark-mode");
        boton.textContent = "Modo claro";
    }

    // Evento click del botón para cambiar modo
    boton.onclick = function() {
        var estaOscuro = document.body.classList.toggle("dark-mode");
        if (estaOscuro) {
            localStorage.setItem("modoOscuro", "activado");
            boton.textContent = "Modo claro";
        } else {
            localStorage.setItem("modoOscuro", "desactivado");
            boton.textContent = "Modo oscuro";
        }
    };
}

// Ejecutar la función cuando el contenido HTML esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarModoOscuro);
} else {
    inicializarModoOscuro();
}
