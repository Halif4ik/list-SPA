"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./utils/database");
const { upload } = require('./midleware/loadFile');
const port = process.env.PORT || 3001;
const app_1 = __importDefault(require("./app"));
try {
    /*if (await sequelize.authenticate()) console.log('Connection has been established successfully.')*/
    database_1.sequelize.sync({ force: false }).then(() => {
        app_1.default.listen(port);
    });
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=index.js.map