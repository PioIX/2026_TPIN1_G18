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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(function(respuesta) {
        return respuesta.text();
    })
    .then(function(texto) {
        if (texto.startsWith("Bienvenido")) {
            mensaje.className = "text-success";
            mensaje.textContent = texto;
            setTimeout(function() {
                window.location.href = "inicio.html";
            }, 1000);
        } else {
            mensaje.className = "text-danger";
            mensaje.textContent = texto + ". Verifica tus datos o registrate.";
        }
    });
}