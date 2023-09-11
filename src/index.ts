import express, {Express, Request, Response} from 'express';
import path from 'node:path';
import bodyParser from "body-parser";
import {apiV1Route} from "./routes/api_V1_route";
import {apiV1LoginRegisRoute} from "./routes/api_V1_login";
import {sequelize} from './utils/database';
import {Model} from "sequelize";
import session from 'express-session';

const {upload} = require('./midleware/loadFile');

const port = process.env.PORT || 3001
import exprApp from './app';

try {
    /*if (await sequelize.authenticate()) console.log('Connection has been established successfully.')*/
    sequelize.sync({force: false}).then(() => {
        exprApp.listen(port)
    });

} catch (e) {
    console.log(e);
}

