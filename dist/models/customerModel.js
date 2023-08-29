"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../utils/database");
exports.CustomerModel = database_1.sequelize.define('customer_list', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER
    },
    login: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING
    },
    pass: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    csrf: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    userName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    homePage: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING
    },
    face: {
        allowNull: true,
        type: sequelize_1.DataTypes.INTEGER
    },
});
//# sourceMappingURL=customerModel.js.map