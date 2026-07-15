var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');
var app = express();
var port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, function () {
  console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function (req, res) {
  res.status(200).send({ message: 'GET Home route working fine!' });
});

// REGISTRO
app.post('/registro', async function (req, res) {
  let existe = await realizarQuery(
    "SELECT * FROM Usuarios WHERE id = " + req.body.dni +
    " OR email = '" + req.body.email + "'"
  );

  if (existe === null) {
    return res.send("Error al conectar con la base de datos");
  }

  if (existe.length > 0) {
    res.send("El DNI o el email ya existe");
  } else {
    await realizarQuery(
      "INSERT INTO Usuarios (id, nombre, email, password, fecha_creacion, es_admin) VALUES (" +
      req.body.dni + ", '" +
      req.body.nombre + "', '" +
      req.body.email + "', '" +
      req.body.password + "', CURDATE(), 0)"
    );
    res.send("Usuario registrado correctamente");
  }
});

// LOGIN
app.post('/login', async function (req, res) {
  let resultado = await realizarQuery(
    "SELECT * FROM Usuarios WHERE email = '" + req.body.email +
    "' AND password = '" + req.body.password + "'"
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

// PREGUNTAS
app.get('/preguntas', async function (req, res) {
  let query = "SELECT * FROM Preguntas";
  if (req.query.dificultad) {
    query += " WHERE dificultad = '" + req.query.dificultad + "'";
  }
  query += " ORDER BY letra ASC";
  let preguntas = await realizarQuery(query);
  if (preguntas === null) return res.json([]);
  res.json(preguntas);
});

app.post('/preguntas', async function (req, res) {
  let resultado = await realizarQuery(
    "INSERT INTO Preguntas (letra, pregunta, respuesta, dificultad) VALUES ('" +
    req.body.letra + "', '" + req.body.pregunta + "', '" +
    req.body.respuesta + "', '" + req.body.dificultad + "')"
  );
  if (resultado === null) return res.send("Error al agregar la pregunta");
  res.send("Pregunta agregada correctamente");
});

app.put('/preguntas/:id', async function (req, res) {
  let resultado = await realizarQuery(
    "UPDATE Preguntas SET letra = '" + req.body.letra +
    "', pregunta = '" + req.body.pregunta +
    "', respuesta = '" + req.body.respuesta +
    "', dificultad = '" + req.body.dificultad +
    "' WHERE id = " + req.params.id
  );
  if (resultado === null) return res.send("Error al editar la pregunta");
  res.send("Pregunta editada correctamente");
});

app.delete('/preguntas/:id', async function (req, res) {
  let resultado = await realizarQuery("DELETE FROM Preguntas WHERE id = " + req.params.id);
  if (resultado === null) return res.send("Error al eliminar la pregunta");
  res.send("Pregunta eliminada correctamente");
});

// USUARIOS
app.get('/usuarios', async function (req, res) {
  let usuarios = await realizarQuery("SELECT id, nombre, email, es_admin FROM Usuarios");
  if (usuarios === null) return res.json([]);
  res.json(usuarios);
});

app.delete('/usuarios/:id', async function (req, res) {
  let resultado = await realizarQuery("DELETE FROM Usuarios WHERE id = " + req.params.id);
  if (resultado === null) return res.send("Error al eliminar el usuario");
  res.send("Usuario eliminado correctamente");
});

// PARTIDAS / PUNTAJES
app.get('/partidas', async function (req, res) {
  let partidas = await realizarQuery(
    "SELECT Partidas.id, Usuarios.nombre, Partidas.puntuacion, Partidas.fecha_creacion " +
    "FROM Partidas JOIN Usuarios ON Partidas.id_usuario = Usuarios.id " +
    "ORDER BY Partidas.puntuacion DESC LIMIT 10"
  );
  if (partidas === null) return res.json([]);
  res.json(partidas);
});

app.post('/partidas', async function (req, res) {
  let resultado = await realizarQuery(
    "INSERT INTO Partidas (id_usuario, puntuacion, fecha_creacion) VALUES (" +
    req.body.idUsuario + ", " + req.body.puntuacion + ", CURDATE())"
  );
  if (resultado === null) return res.send("Error al guardar el puntaje");
  res.send("Puntaje guardado correctamente");
});

app.delete('/partidas/:id', async function (req, res) {
  let resultado = await realizarQuery("DELETE FROM Partidas WHERE id = " + req.params.id);
  if (resultado === null) return res.send("Error al eliminar el puntaje");
  res.send("Puntaje eliminado correctamente");
});