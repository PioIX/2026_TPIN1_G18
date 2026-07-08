function handleLogin() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var mensaje = document.getElementById("mensajeLogin");

  if (email == "" || password == "") {
    mensaje.textContent = "Por favor completa todos los campos.";
    mensaje.className = "text-danger";
    return;
  }

  fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(function(respuesta) { return respuesta.json(); })
  .then(function(datos) {
    if (datos.success) {
      mensaje.className = "text-success";
      mensaje.textContent = datos.mensaje;
      localStorage.setItem("usuarioNombre", datos.nombre);
      localStorage.setItem("esAdmin", datos.esAdmin);
      setTimeout(function() {

        /*Qué hace exactamente el códigoEl código evalúa si la propiedad datos.esAdmin es verdadera o falsa:
        Si datos.esAdmin es true: Redirige al usuario a "admin.html".
        Si datos.esAdmin es false (o null/undefined): Redirige al usuario a "inicio.html". */
        window.location.href = datos.esAdmin ? "admin.html" : "inicio.html";
      }, 1000);
    } else {
      mensaje.className = "text-danger";
      mensaje.textContent = datos.mensaje + ". Verifica tus datos o registrate.";
    }
  });
}
