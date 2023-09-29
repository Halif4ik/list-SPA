import {Sequelize} from 'sequelize'

const HOST: string = process.env.DB_HOST || '127.0.0.1';
const USER: string = process.env.DB_USER || 'root';
const PASSWORD: string = process.env.DB_PASSWORD || 'gremlin2';
const DB: string = process.env.DB_NAME || 'chat_spa_loc2';
const port: string | number = process.env.DB_PORT || 3306;

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

