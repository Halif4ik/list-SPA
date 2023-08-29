"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const DB_NAME = 'todo-ListSPA';
const USER_NAME = 'root';
const PASSWORD = 'gremlin2';
exports.sequelize = new sequelize_1.Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
});
//# sourceMappingURL=database.js.map