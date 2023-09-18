import {Sequelize} from 'sequelize'

const DB_NAME = process.env.DB_HOST || 'listspa';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const PASSWORD = process.env.DB_PASSWORD || 'gremlin2';
const USER_NAME = process.env.DB_USER || 'root';
const DB_PORT = process.env.DB_PORT || 3306;

export const sequelize: Sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
});

/*
export const sequelize = new Sequelize(`mysql://${USER_NAME}:${PASSWORD}@${HOST}:${DB_PORT}/${DB_NAME}`)*/
