function handleRegistro() {
  var dni = document.getElementById("dni").value;
  var nombre = document.getElementById("nombre").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var mensaje = document.getElementById("mensajeRegistro");

  if (dni == "" || nombre == "" || email == "" || password == "") {
    mensaje.textContent = "Por favor completa todos los campos.";
    mensaje.className = "text-danger";
    return;
  }

  if (dni.length < 7 || dni.length > 8) {
    mensaje.textContent = "El DNI debe tener entre 7 y 8 numeros.";
    mensaje.className = "text-danger";
    return;
  }

  if (email.indexOf("@") === -1) {
    mensaje.textContent = "El email debe contener un @.";
    mensaje.className = "text-danger";
    return;
  }

  if (password.length < 8) {
    mensaje.textContent = "La contrasena debe tener al menos 8 caracteres.";
    mensaje.className = "text-danger";
    return;
  }

  fetch("http://localhost:4000/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dni: dni,
      nombre: nombre,
      email: email,
      password: password
    })
  })
  .then(function(respuesta) {
    return respuesta.text();
  })
  .then(function(texto) {
    if (texto == "Usuario registrado correctamente") {
      mensaje.className = "text-success";
      mensaje.textContent = texto + ". Redirigiendo al login...";
      setTimeout(function() {
        window.location.href = "index.html";
      }, 1500);
    } else {
      mensaje.className = "text-danger";
      mensaje.textContent = texto;
    }
  });
}