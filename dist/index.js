"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_V1_route_1 = require("./routes/api_V1_route");
const api_V1_login_1 = require("./routes/api_V1_login");
const database_1 = require("./utils/database");
const express_session_1 = __importDefault(require("express-session"));
const port = process.env.PORT || 3001;
const exprApp = (0, express_1.default)();
exprApp.use(express_1.default.static(node_path_1.default.join(__dirname, '../public')));
exprApp.use('/uploads', express_1.default.static(node_path_1.default.join(__dirname, '../uploads')));
/*exprApp.use(express.urlencoded({extended: true}))*/
exprApp.use((0, body_parser_1.default)({}));
const SequelizeStore = require('connect-session-sequelize')(express_session_1.default.Store);
const sessionStore = new SequelizeStore({
    db: database_1.sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 7 * 24 * 60 * 60 * 1000 // 1 week
});
exprApp.use((0, express_session_1.default)({
    secret: 'some secret word',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
}));
exprApp.use('/api/v1/items', api_V1_route_1.apiV1Route);
exprApp.use('/api/v1', api_V1_login_1.apiV1LoginRegisRoute);
exprApp.use((req, res) => {
    res.sendFile('/index.html');
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /*if (await sequelize.authenticate()) console.log('Connection has been established successfully.')*/
            yield database_1.sequelize.sync({ force: true });
            exprApp.listen(port);
        }
        catch (e) {
            console.log(e);
        }
    });
}
start();
//# sourceMappingURL=index.js.map