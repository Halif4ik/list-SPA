import express, {Request, Response} from 'express';
import path from 'node:path';
import bodyParser from "body-parser";
import {apiV1Route} from "./routes/api_V1_route";
import {sequelize} from './utils/database';
import connect from 'connect';
const session = require('express-session');
const port = process.env.PORT || 3001
const exprApp = express()

exprApp.use(express.static(path.join(__dirname, '../public')))
exprApp.use('/uploads', express.static(path.join(__dirname, '../uploads')))

/*exprApp.use(express.urlencoded({extended: true}))  const SequelizeStore = require('connect-session-sequelize')(connect.session.Store);*/
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
exprApp.use((req: Request, res: Response) => {
    res.sendFile('/index.html');
});

async function start() {
    try {
        /*if (await sequelize.authenticate()) console.log('Connection has been established successfully.')*/
        await sequelize.sync({ force: true });
        exprApp.listen(port)
    } catch (e) {
        console.log(e);
    }
}
start()

