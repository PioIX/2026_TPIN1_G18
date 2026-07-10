var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { realizarQuery } = require('./modules/mysql'); // Ruta CORRECTA a modules
var app = express();
var port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos del frontend (alternativa sin módulo path)
app.use(express.static('../front-end'));

// Ruta raíz: servir la página de login
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/../front-end/index.html');
});

app.listen(port, function () {
  console.log('Server running in http://localhost:' + port);
});

// registro
app.post('/registro', async function (req, res) {
    let existe = await realizarQuery(
        "SELECT * FROM Usuarios WHERE id = ? OR email = ?",
        [req.body.dni, req.body.email]
    );

    if (existe === null) {
        return res.send("Error al conectar con la base de datos");
    }

    if (existe.length > 0) {
        let errores = [];
        for (let i = 0; i < existe.length; i++) {
            let usuario = existe[i];
            if (usuario.id == req.body.dni && errores.indexOf("DNI") === -1) {
                errores.push("DNI");
            }
            if (usuario.email == req.body.email && errores.indexOf("email") === -1) {
                errores.push("email");
            }
        }
        res.send("El " + errores.join(" y el ") + " ya existe");
    } else {
        await realizarQuery(
            "INSERT INTO Usuarios (id, nombre, email, password, fecha_creacion, es_admin) VALUES (?, ?, ?, ?, CURDATE(), 0)",
            [req.body.dni, req.body.nombre, req.body.email, req.body.password]
        );
        res.send("Usuario registrado correctamente");
    }
});

// LOGIN
app.post('/login', async function (req, res) {
  let resultado = await realizarQuery(
      "SELECT * FROM Usuarios WHERE email = ? AND password = ?",
      [req.body.email, req.body.password]
  );

  if (resultado === null) {
    return res.json({ success: false, mensaje: "Error al conectar con la base de datos" });
  }

  if (resultado.length > 0) {
    res.json({
      success: true,
      mensaje: "Bienvenido " + resultado[0].nombre,
      id: resultado[0].id,
      nombre: resultado[0].nombre,
      esAdmin: resultado[0].es_admin == 1
    });
  } else {
    res.json({ success: false, mensaje: "Los datos son incorrectos" });
  }
});

// Traer todas las preguntas
app.get('/preguntas', async function (req, res) {
  let preguntas = await realizarQuery("SELECT * FROM Preguntas");
  if (preguntas === null) return res.json([]);
  res.json(preguntas);
});

// Agregar pregunta
app.post('/preguntas', async function (req, res) {
  let resultado = await realizarQuery(
      "INSERT INTO Preguntas (letra, pregunta, respuesta, dificultad) VALUES (?, ?, ?, ?)",
      [req.body.letra, req.body.pregunta, req.body.respuesta, req.body.dificultad]
  );
  if (resultado === null) return res.send("Error al agregar la pregunta");
  res.send("Pregunta agregada correctamente");
});

// Editar pregunta
app.put('/preguntas/:id', async function (req, res) {
  let resultado = await realizarQuery(
      "UPDATE Preguntas SET letra = ?, pregunta = ?, respuesta = ?, dificultad = ? WHERE id = ?",
      [req.body.letra, req.body.pregunta, req.body.respuesta, req.body.dificultad, req.params.id]
  );
  if (resultado === null) return res.send("Error al editar la pregunta");
  res.send("Pregunta editada correctamente");
});

// Eliminar pregunta
app.delete('/preguntas/:id', async function (req, res) {
  let resultado = await realizarQuery("DELETE FROM Preguntas WHERE id = ?", [req.params.id]);
  if (resultado === null) return res.send("Error al eliminar la pregunta");
  res.send("Pregunta eliminada correctamente");
});

// Traer usuarios (para el panel admin)
app.get('/usuarios', async function (req, res) {
  let usuarios = await realizarQuery("SELECT id, nombre, email, es_admin FROM Usuarios");
  if (usuarios === null) return res.json([]);
  res.json(usuarios);
});

// Eliminar usuario
app.delete('/usuarios/:id', async function (req, res) {
  let resultado = await realizarQuery("DELETE FROM Usuarios WHERE id = ?", [req.params.id]);
  if (resultado === null) return res.send("Error al eliminar el usuario");
  res.send("Usuario eliminado correctamente");
});

// Traer puntajes (panel admin y futuro ranking)
app.get('/partidas', async function (req, res) {
    let partidas = await realizarQuery(
        "SELECT Partidas.id, Usuarios.nombre, Partidas.puntuacion, Partidas.fecha_creacion " +
        "FROM Partidas JOIN Usuarios ON Partidas.id_usuario = Usuarios.id " +
        "ORDER BY Partidas.puntuacion DESC"
    );
    if (partidas === null) return res.json([]);
    res.json(partidas);
});

// Guardar puntaje al terminar la partida
app.post('/partidas', async function (req, res) {
  let resultado = await realizarQuery(
      "INSERT INTO Partidas (id_usuario, puntuacion, fecha_creacion) VALUES (?, ?, CURDATE())",
      [req.body.idUsuario, req.body.puntuacion]
  );
  if (resultado === null) return res.send("Error al guardar el puntaje");
  res.send("Puntaje guardado correctamente");
});

// Eliminar puntaje
app.delete('/partidas/:id', async function (req, res) {
  let resultado = await realizarQuery("DELETE FROM Partidas WHERE id = ?", [req.params.id]);
  if (resultado === null) return res.send("Error al eliminar el puntaje");
  res.send("Puntaje eliminado correctamente");
});
