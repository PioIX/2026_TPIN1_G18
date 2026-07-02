if (!localStorage.getItem("usuarioNombre")) {
  window.location.href = "index.html";
}

var elementoBienvenida = document.getElementById("bienvenida");
if (elementoBienvenida) {
  elementoBienvenida.textContent = "Bienvenido " + localStorage.getItem("usuarioNombre") + "!";
}

function cerrarSesion() {
  var confirmado = confirm("Estas seguro de que queres cerrar sesion?");
  if (confirmado) {
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("esAdmin");
    window.location.href = "index.html";
  }
}
