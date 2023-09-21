const Sequelize = require("sequelize");
import {sequelize} from './indexDb'
import Post from "./post";
import Commit from './Commits';
import Customer from "../models/customer";





export const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = new Post(sequelize, Sequelize);
db.commits = new Commit(sequelize, Sequelize);
db.customers = new Customer(sequelize, Sequelize);

