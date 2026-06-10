import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Pessoa = banco.define("pessoa", {
    idusuario: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },

    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },

    perfil: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "CIDADAO"
    },

    pontos: {
        type: DataTypes.INTEGER,
        defaultValue: 20
    }
}, {
    freezeTableName: true // Garante que o Sequelize use exatamente o nome "pessoa"
});

export default Pessoa;