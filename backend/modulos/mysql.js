// Importar librería para conectar a MySQL
const mySql = require("mysql2/promise");

// Configuración para conectarse a la base de datos (datos desde .env)
const SQL_CONFIGURATION_DATA = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
  charset: 'UTF8_GENERAL_CI'
}

// Función para ejecutar consultas SQL (con soporte para parametros)
exports.realizarQuery = async function (queryString, params) {
  let connection; // Variable para la conexión a la BD
  let returnObject; // Variable para guardar el resultado
  try {
    // Crear la conexión usando la configuración
    connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
    // Ejecutar la consulta (con o sin parametros)
    if (params) {
      returnObject = await connection.execute(queryString, params);
    } else {
      returnObject = await connection.execute(queryString);
    }
  } catch (err) {
    // Si hay error, mostrarlo en consola y devolver null
    console.log(err);
    return null;
  } finally {
    // Cerrar la conexión siempre, incluso si hubo error
    if (connection && connection.end) connection.end();
  }
  return returnObject[0]; // Devolver solo los resultados (sin metadata)
}