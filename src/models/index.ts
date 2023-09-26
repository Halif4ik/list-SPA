const Sequelize = require("sequelize");
import {sequelize} from './indexDb'
import Post from "./post";
import Commit from './Commits';
import Customer from "../models/customer";
export const db = {
    Sequelize : Sequelize,
    sequelize : sequelize,
    posts : new Post(sequelize, Sequelize),
    commits : new Commit(sequelize, Sequelize),
    customers : new Customer(sequelize, Sequelize),
};

