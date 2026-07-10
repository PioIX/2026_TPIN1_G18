// URL base del servidor backend
const API = "http://localhost:4000";
// Lista de letras del rosco
const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
// Contenedor donde se dibujará el rosco
const contenedor = document.getElementById("rosco-circulo");
// Radio del círculo del rosco
const radio = 180;
// Centro del círculo
const centro = 225;

// Variables globales del juego
var activa = 0; // Índice de la letra activa
var preguntasSeleccionadas = []; // Preguntas seleccionadas para la partida
var preguntasPorLetra = {}; // Preguntas agrupadas por letra
var aciertos = 0; // Contador de aciertos
var nodos = []; // Array con los elementos HTML de las letras
var timerInterval = null; // Intervalo del timer
var segundosRestantes = 0; // Segundos restantes del timer
var juegoTerminado = false; // Bandera para saber si el juego terminó
var dificultadActual = ""; // Dificultad seleccionada

// Función para mezclar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    let nuevoArray = array.slice(); // Hacer copia del array
    for (let i = nuevoArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio
        let temp = nuevoArray[i];
        nuevoArray[i] = nuevoArray[j];
        nuevoArray[j] = temp;
    }
    return nuevoArray;
}

// Función para dibujar el rosco en la página
function dibujarRosco() {
    let total = letras.length;
    for (let i = 0; i < total; i++) {
        let nodo = document.createElement("div");
        nodo.className = "rosco-letra";
        nodo.textContent = letras[i];

        // Calcular posición de la letra en el círculo
        let angulo = (i * 2 * Math.PI / total) - Math.PI / 2;
        let x = centro + radio * Math.cos(angulo) - 22;
        let y = centro + radio * Math.sin(angulo) - 22;
        nodo.style.left = x + "px";
        nodo.style.top = y + "px";

        // Evento click para activar la letra
        let idx = i;
        nodo.onclick = function () {
            let estaContestada = false;
            let clases = nodos[idx].className.split(" ");
            for (let c = 0; c < clases.length; c++) {
                if (clases[c] === "correcta" || clases[c] === "incorrecta") {
                    estaContestada = true;
                }
            }
            if (!estaContestada && !juegoTerminado) {
                activarLetra(idx);
            }
        };

        contenedor.appendChild(nodo);
        nodos.push(nodo);
    }
}

// Función para activar una letra (mostrar su pregunta)
function activarLetra(indice) {
    // Quitar la clase "activa" de todas las letras
    for (let i = 0; i < nodos.length; i++) {
        let clases = nodos[i].className.split(" ");
        let nuevasClases = [];
        for (let c = 0; c < clases.length; c++) {
            if (clases[c] !== "activa") {
                nuevasClases.push(clases[c]);
            }
        }
        nodos[i].className = nuevasClases.join(" ");
    }

    // Agregar la clase "activa" a la letra seleccionada
    let clasesNueva = nodos[indice].className.split(" ");
    clasesNueva.push("activa");
    nodos[indice].className = clasesNueva.join(" ");

    activa = indice;
    let preguntaActual = preguntasSeleccionadas[activa];
    if (preguntaActual) {
        document.getElementById("rosco-descripcion").textContent = preguntaActual.pregunta;
        document.getElementById("rosco-pista").textContent = "La palabra incluye la letra: " + preguntaActual.letra;
        document.getElementById("rosco-respuesta").value = ""; // Limpiar input
    }
}

// Función para iniciar el temporizador
function iniciarTimer(minutos) {
    segundosRestantes = minutos * 60;
    actualizarTimerDisplay();
    // Actualizar timer cada segundo
    timerInterval = setInterval(function() {
        segundosRestantes--;
        actualizarTimerDisplay();
        if (segundosRestantes <= 0) {
            clearInterval(timerInterval);
            terminarPartida(true); // Terminar partida por tiempo agotado
        }
    }, 1000);
}

// Función para actualizar el display del timer
function actualizarTimerDisplay() {
    let mins = Math.floor(segundosRestantes / 60);
    let segs = segundosRestantes % 60;
    // Formatear con ceros a la izquierda
    document.getElementById("rosco-tiempo").textContent = 
        (mins < 10 ? "0" + mins : mins) + ":" + (segs < 10 ? "0" + segs : segs);
}

// Función para pasar a la siguiente letra
function pasapalabra() {
    if (juegoTerminado) return;

    let estaCorrecta = false;
    let estaIncorrecta = false;
    let estaPasada = false;
    let clases = nodos[activa].className.split(" ");
    // Verificar estado actual de la letra
    for (let c = 0; c < clases.length; c++) {
        if (clases[c] === "correcta") estaCorrecta = true;
        if (clases[c] === "incorrecta") estaIncorrecta = true;
        if (clases[c] === "pasada") estaPasada = true;
    }
    // Si no está contestada, marcar como pasada
    if (!estaCorrecta && !estaIncorrecta && !estaPasada) {
        let nuevasClases = [];
        for (let c = 0; c < clases.length; c++) {
            if (clases[c] !== "activa") {
                nuevasClases.push(clases[c]);
            }
        }
        nuevasClases.push("pasada");
        nodos[activa].className = nuevasClases.join(" ");
    }

    // Encontrar la siguiente letra no contestada
    let siguiente = (activa + 1) % letras.length;
    let contador = 0;
    
    while (contador < letras.length) {
        let estaCorrectaSiguiente = false;
        let estaIncorrectaSiguiente = false;
        let clasesSiguiente = nodos[siguiente].className.split(" ");
        for (let c = 0; c < clasesSiguiente.length; c++) {
            if (clasesSiguiente[c] === "correcta") estaCorrectaSiguiente = true;
            if (clasesSiguiente[c] === "incorrecta") estaIncorrectaSiguiente = true;
        }
        let estaContestada = estaCorrectaSiguiente || estaIncorrectaSiguiente;
        
        if (!estaContestada) break;
        siguiente = (siguiente + 1) % letras.length;
        contador++;
    }
    activarLetra(siguiente);
}

// Función para comprobar la respuesta del usuario
function comprobarRespuesta() {
    if (juegoTerminado) return;

    let respuestaUsuario = document.getElementById("rosco-respuesta").value;
    respuestaUsuario = respuestaUsuario.trim().toLowerCase();
    
    // Validar que la respuesta no esté vacía
    if (respuestaUsuario.length === 0) {
        document.getElementById("rosco-error").style.display = "block";
        return;
    } else {
        document.getElementById("rosco-error").style.display = "none";
    }
    
    let respuestaCorrecta = preguntasSeleccionadas[activa].respuesta;
    respuestaCorrecta = respuestaCorrecta.trim().toLowerCase();
    
    // Comparar respuestas
    if (respuestaUsuario === respuestaCorrecta) {
        let clases = nodos[activa].className.split(" ");
        let nuevasClases = [];
        for (let c = 0; c < clases.length; c++) {
            if (clases[c] !== "activa" && clases[c] !== "pasada") {
                nuevasClases.push(clases[c]);
            }
        }
        nuevasClases.push("correcta");
        nodos[activa].className = nuevasClases.join(" ");
        aciertos++;
        document.getElementById("rosco-aciertos").textContent = aciertos;
    } else {
        let clases = nodos[activa].className.split(" ");
        let nuevasClases = [];
        for (let c = 0; c < clases.length; c++) {
            if (clases[c] !== "activa" && clases[c] !== "pasada") {
                nuevasClases.push(clases[c]);
            }
        }
        nuevasClases.push("incorrecta");
        nodos[activa].className = nuevasClases.join(" ");
    }
    
    // Verificar si todas las letras están contestadas
    let todasContestadas = true;
    for (let i = 0; i < nodos.length; i++) {
        let estaContestada = false;
        let clases = nodos[i].className.split(" ");
        for (let c = 0; c < clases.length; c++) {
            if (clases[c] === "correcta" || clases[c] === "incorrecta") {
                estaContestada = true;
            }
        }
        if (!estaContestada) {
            todasContestadas = false;
            break;
        }
    }
    
    if (todasContestadas) {
        terminarPartida(false);
    } else {
        // Pasar a la siguiente letra no contestada
        let siguiente = (activa + 1) % letras.length;
        let contador = 0;
        
        while (contador < letras.length) {
            let estaContestada = false;
            let clases = nodos[siguiente].className.split(" ");
            for (let c = 0; c < clases.length; c++) {
                if (clases[c] === "correcta" || clases[c] === "incorrecta") {
                    estaContestada = true;
                }
            }
            
            if (!estaContestada) break;
            siguiente = (siguiente + 1) % letras.length;
            contador++;
        }
        activarLetra(siguiente);
    }
}

// Función para terminar la partida
function terminarPartida(tiempoAgotado) {
    juegoTerminado = true;
    clearInterval(timerInterval);

    // Si se agotó el tiempo, marcar todas las no contestadas como incorrectas
    if (tiempoAgotado) {
        for (let i = 0; i < nodos.length; i++) {
            let estaCorrecta = false;
            let estaIncorrecta = false;
            let clases = nodos[i].className.split(" ");
            for (let c = 0; c < clases.length; c++) {
                if (clases[c] === "correcta") estaCorrecta = true;
                if (clases[c] === "incorrecta") estaIncorrecta = true;
            }
            if (!estaCorrecta && !estaIncorrecta) {
                let nuevasClases = [];
                for (let c = 0; c < clases.length; c++) {
                    if (clases[c] !== "activa" && clases[c] !== "pasada") {
                        nuevasClases.push(clases[c]);
                    }
                }
                nuevasClases.push("incorrecta");
                nodos[i].className = nuevasClases.join(" ");
            }
        }
    }

    // Mostrar mensaje y botón para guardar partida
    let mensaje = tiempoAgotado 
        ? "¡Tiempo agotado! Aciertos: " + aciertos
        : "¡Partida terminada! Aciertos: " + aciertos;
    alert(mensaje);
    document.getElementById("btn-guardar-partida").style.display = "block";
}

// Función para guardar la partida en la base de datos
function guardarPartida() {
    let idUsuario = localStorage.getItem("usuarioId");
    if (!idUsuario) {
        alert("No hay usuario logueado para guardar la partida");
        return;
    }

    // Enviar datos al servidor
    fetch(API + "/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idUsuario: idUsuario,
            puntuacion: aciertos
        })
    })
    .then(function(respuesta) { return respuesta.text(); })
    .then(function(mensaje) {
        alert(mensaje);
        document.getElementById("btn-guardar-partida").style.display = "none";
    })
    .catch(function(error) {
        alert("Error al guardar la partida: " + error);
    });
}

// Función para iniciar un nuevo juego
function iniciarJuego(dificultad) {
    // Reiniciar variables del juego
    activa = 0;
    preguntasSeleccionadas = [];
    aciertos = 0;
    juegoTerminado = false;
    document.getElementById("rosco-aciertos").textContent = "0";
    document.getElementById("btn-guardar-partida").style.display = "none";

    // Reiniciar todas las letras
    for (let i = 0; i < nodos.length; i++) {
        nodos[i].className = "rosco-letra";
    }

    // Establecer dificultad y tiempo
    dificultadActual = dificultad;
    let minutos = 6;
    if (dificultad === "Medio") minutos = 4;
    if (dificultad === "Dificil") minutos = 2;
    iniciarTimer(minutos);

    // Cargar preguntas del servidor
    fetch(API + "/preguntas")
    .then(function(respuesta) { return respuesta.json(); })
    .then(function(preguntas) {
        // Agrupar preguntas por letra
        let preguntasPorLetraLocal = {};
        for (let i = 0; i < letras.length; i++) {
            preguntasPorLetraLocal[letras[i]] = [];
        }
        for (let i = 0; i < preguntas.length; i++) {
            let letra = preguntas[i].letra.toUpperCase();
            if (preguntasPorLetraLocal[letra]) {
                preguntasPorLetraLocal[letra].push(preguntas[i]);
            }
        }

        // Seleccionar una pregunta por letra (según dificultad)
        preguntasSeleccionadas = [];
        for (let i = 0; i < letras.length; i++) {
            let letra = letras[i];
            let opciones = [];
            let todasLasPreguntas = preguntasPorLetraLocal[letra];
            for (let j = 0; j < todasLasPreguntas.length; j++) {
                if (todasLasPreguntas[j].dificultad === dificultad) {
                    opciones.push(todasLasPreguntas[j]);
                }
            }
            if (opciones.length === 0) {
                opciones = todasLasPreguntas;
            }
            if (opciones.length > 0) {
                let mezcladas = shuffleArray(opciones);
                preguntasSeleccionadas.push(mezcladas[0]);
            }
        }

        // Mostrar contenedor del juego y ocultar selector de dificultad
        document.getElementById("selector-dificultad").style.display = "none";
        document.getElementById("juego-container").style.display = "block";

        // Activar la primera pregunta
        activarLetra(0);
    })
    .catch(function(error) {
        alert("Error al cargar las preguntas: " + error);
    });
}

// Dibujar el rosco cuando se carga la página
dibujarRosco();
