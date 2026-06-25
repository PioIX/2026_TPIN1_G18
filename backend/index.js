var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); // Creamos la aplicación Express (el servidor)
var port = process.env.PORT || 4000;