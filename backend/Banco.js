import { Sequelize } from "sequelize";
import 'dotenv/config';

const banco = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
 dialect: "postgres",
 port: 5432,
 host: process.env.DB_HOST,
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

export default banco;