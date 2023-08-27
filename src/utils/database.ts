import {Sequelize} from 'sequelize'

const DB_NAME = 'todo-ListSPA';
const USER_NAME = 'root';
const PASSWORD = 'gremlin2';

export const sequelize: Sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
})