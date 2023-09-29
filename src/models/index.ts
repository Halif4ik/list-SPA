const Sequelize = require("sequelize");
import {sequelize} from './indexDb'
import {Commit,Post,Customer} from './modelsDb';
export const db = {
    Sequelize : Sequelize,
    sequelize : sequelize,
    posts : new Post(sequelize, Sequelize),
    commits : new Commit(sequelize, Sequelize),
    customers : new Customer(sequelize, Sequelize),
};

