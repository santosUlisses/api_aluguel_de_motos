const { DataTypes, ENUM } = require('sequelize');


const conn = require('../shared/db/db');


const Moto = conn.define("Moto", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cor: {
        type: DataTypes.STRING,
        allowNull: false,
    }
    ,
    disponibilidade: {
        type: DataTypes.ENUM("disponivel", "alugada", "indisponivel"),
        defaultValue: "disponivel",
    },
    descricao: {
        type: DataTypes.STRING(120),
    },
    placa: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
});



module.exports = Moto;