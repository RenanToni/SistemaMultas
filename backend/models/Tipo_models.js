import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Tipo = banco.define(
    'tipo',
    {
        idtipo: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preco : {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        taxa : {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        pontos: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }
);


export default Tipo;