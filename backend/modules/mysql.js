const mySql = require("mysql2/promise");

const SQL_CONFIGURATION_DATA = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
  charset: 'UTF8_GENERAL_CI'
}

exports.realizarQuery = async function (queryString) {
  let connection;
  let returnObject;
  try {
    connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
    returnObject = await connection.execute(queryString);
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    if (connection && connection.end) connection.end();
  }
  return returnObject[0];
}