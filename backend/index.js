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
      nombre: resultado[0].nombre,
      esAdmin: resultado[0].es_admin == 1
    });
  } else {
    res.json({ success: false, mensaje: "Los datos son incorrectos" });
  }
});