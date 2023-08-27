"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
exports.todoModel = database_1.sequelize.define('TodoList', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER
    },
    checked: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    text: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    editable: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN
    },
    login: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    userName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    face: {
        allowNull: true,
        type: sequelize_1.DataTypes.INTEGER
    },
});
//# sourceMappingURL=todoModel.js.map