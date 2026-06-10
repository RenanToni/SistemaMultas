import banco from "../Banco.js";
import { DataTypes } from "sequelize";
import Pessoa from "./Pessoa_models.js";

const Veiculo = banco.define("veiculo", {

    idveiculo: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    idusuario: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    placa: {
        type: DataTypes.STRING,
        allowNull: false
    },

    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },

    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

Veiculo.belongsTo(Pessoa,{
    foreignKey:"idusuario"
});

export default Veiculo;