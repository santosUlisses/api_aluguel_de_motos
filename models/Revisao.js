const { DataTypes } = require('sequelize');
const conn = require('../src/shared/db/db');


const Revisao = conn.define("Revisao", {
    detalhes: {
        type: DataTypes.STRING,
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
    },
    data_revisao: {
        type: DataTypes.DATEONLY,
    }
}, { tableName: "revisao" });

module.exports = Revisao;