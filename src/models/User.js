const { DataTypes } = require('sequelize');

const conn = require('../shared/db/db');

const User = conn.define("User", {
    nome: {
        type: DataTypes.STRING,
    },
    tipo_usuario: {
        type: DataTypes.ENUM('admin', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente'
    },
    email: {
        type: DataTypes.STRING,
    },
    senha: {
        type: DataTypes.STRING,
    }
});


module.exports = User;