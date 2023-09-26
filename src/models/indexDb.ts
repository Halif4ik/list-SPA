import {Sequelize} from 'sequelize'

const HOST = process.env.DB_HOST || '127.0.0.1';
const USER = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || 'gremlin2';
const DB = process.env.DB_NAME || 'chat_spa_loc';
const port = process.env.DB_PORT || 3306;

export const sequelize: Sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: "mysql",
    port: port,
    operatorsAliases: false,
    logging: false,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

