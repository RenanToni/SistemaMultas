import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Pessoa = banco.define(
    'pessoa',
    {
        idusuario: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf : {
            type: DataTypes.STRING,
            allowNull: false
        },
        pontos : {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }
);

export default Pessoa;