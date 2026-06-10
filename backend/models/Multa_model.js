import banco from "../Banco.js";
import { DataTypes } from "sequelize";

import Tipo from "./Tipo_models.js";
import Pessoa from "./Pessoa_models.js";
import Veiculo from "./Veiculo_model.js";

const Multa = banco.define('multa', {
    idmultas: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    idusuario: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Pessoa,
            key: 'idusuario'
        }
    },

    idtipo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Tipo,
            key: 'idtipo'
        }
    },

    idveiculo: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: Veiculo,
            key: 'idveiculo'
        }
    },

    datainfracao: {
        type: DataTypes.DATE,
        allowNull: false
    },

    datavencimento: {
        type: DataTypes.DATE,
        allowNull: false
    },

    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    tableName: 'multa',
    timestamps: false
});


// ================= ASSOCIAÇÕES =================
Multa.belongsTo(Pessoa, { foreignKey: 'idusuario' });
Multa.belongsTo(Tipo, { foreignKey: 'idtipo' });
Multa.belongsTo(Veiculo, { foreignKey: 'idveiculo' });

export default Multa;