const { DataTypes, BOOLEAN } = require("sequelize");
const conn = require('../shared/db/db');


const MotoImagens = conn.define("Moto_Imagens", {
    url: {
        type: DataTypes.STRING,
    },
    destaque: {
        type: BOOLEAN,
        defaultValue: false,
    }

}, { tableName: "moto_imagens" });

module.exports = MotoImagens;