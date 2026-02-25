const { Sequelize } = require('sequelize');
const senha = process.env.senha_banco;

const conn = new Sequelize("aluguelmotos", "root", senha, { host: "localhost", dialect: "mysql" });



module.exports = conn;