import express, {Request, Response} from 'express';
import path from 'node:path';
import bodyParser from "body-parser";
import {apiV1Route} from "./routes/api_V1_route";
import {apiV1LoginRegisRoute} from "./routes/api_V1_login";
import {sequelize} from './utils/database';
import {Model} from "sequelize";
import session from 'express-session';
declare module 'express-session' {
    export interface SessionData {
        customer: Model<any,any>[];
        isAuthenticated: boolean;
        secretForCustomer: string;
        face: string;
    }
}
const port = process.env.PORT || 3001
const exprApp = express()

exprApp.use(express.static(path.join(__dirname, '../public')))
exprApp.use('/uploads', express.static(path.join(__dirname, '../uploads')))

/*exprApp.use(express.urlencoded({extended: true}))*/
exprApp.use(bodyParser({}));

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 7 * 24 * 60 * 60 * 1000 // 1 week
});
exprApp.use(session({
    secret: 'some secret word',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
}))

exprApp.use('/api/v1/items', apiV1Route);
exprApp.use('/api/v1', apiV1LoginRegisRoute);
exprApp.use((req: Request, res: Response) => {
    res.sendFile('/index.html');
});

async function start() {
    try {
        /*if (await sequelize.authenticate()) console.log('Connection has been established successfully.')*/
        await sequelize.sync({ force: false });
        exprApp.listen(port)
    } catch (e) {
        console.log(e);
    }
}
start()

