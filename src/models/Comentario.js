const { DataTypes } = require("sequelize");
const conn = require("../shared/db/db");

const Comentario = conn.define("Comentario", {
    comentario: {
        type: DataTypes.STRING
    },
    nota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    status: {
        type: DataTypes.ENUM("pendente", "aprovado", "reprovado"),
        defaultValue: "pendente",
    }

})
module.exports = Comentario;