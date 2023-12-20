// ./config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'banco',
  port: '3306',
});

db.connect(error => {
  if (error) throw error;
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
});

module.exports = db;