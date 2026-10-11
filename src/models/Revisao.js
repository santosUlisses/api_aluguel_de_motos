const { DataTypes } = require('sequelize');
const conn = require('../shared/db/db');


const Revisao = conn.define("Revisao", {
    detalhes: {
        type: DataTypes.STRING(255),
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
    },
    quilometragem: {
        type: DataTypes.INTEGER,
    },
    data_revisao: {
        type: DataTypes.DATEONLY,
    }
}, { tableName: "revisao" });

module.exports = Revisao;