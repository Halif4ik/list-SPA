import {Sequelize} from 'sequelize'
import {DB_NAME} from "../const.dev";
import {USER_NAME} from "../const.dev";
import {PASSWORD} from "../const.dev";

export const sequelize: Sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
})