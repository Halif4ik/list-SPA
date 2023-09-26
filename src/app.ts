import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {apiV1Route} from './routes/api_V1_route';
import {apiV1LoginRegisRoute} from "./routes/api_V1_login";
import path from "path";
import session from "express-session";
import {sequelize} from "./models/indexDb";
import {Model} from "sequelize";
import cors from "cors";

declare module 'express-session' {
    export interface SessionData {
        customer: Model<any, any>[];
        isAuthenticated: boolean;
        secretForCustomer: string;
        face: string;
    }
}


class App {
    public app: express.Application;
    private allowedOrigins: string[] = [
        'http://grymachtest.ddns.net',
        'http://91.214.247.147',
        'http://127.0.0.1:3001',
    ];
    constructor() {
        this.app = express();
        this.config();
        this.allRoutes();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors({origin: this.allowedOrigins, credentials: true}));
        /*this.app.use(cors({
            origin: (origin, callback): void => {
                console.log('this.allowedOrigins-',this.allowedOrigins);
                console.log('origin-',origin);
                if (this.allowedOrigins.includes(origin)) callback(null, true);
                else callback(new Error('Not allowed by CORS'));
            },
        }));
   */
        const SequelizeStore = require('connect-session-sequelize')(session.Store);
        const sessionStore = new SequelizeStore({
            db: sequelize,
            checkExpirationInterval: 15 * 60 * 1000,
            expiration: 7 * 24 * 60 * 60 * 1000 // 1 week
        });
        this.app.use(session({
            secret: 'some secret word',
            resave: false,
            saveUninitialized: false,
            store: sessionStore,
        }));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.use('/static', express.static(path.join(__dirname, '../public/upload')));
    }

    private allRoutes(): void {
        this.app.use('/api/v1/items', apiV1Route);
        this.app.use('/api/v1', apiV1LoginRegisRoute);
        this.app.use((req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    }
}

export default new App().app;
