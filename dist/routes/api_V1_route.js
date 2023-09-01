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
exports.apiV1Route = void 0;
const express_1 = require("express");
const validator_1 = require("../midleware/validator");
const iscorectToken_1 = require("../midleware/iscorectToken");
const postsModel_1 = require("../models/postsModel");
const comentsOfPost_1 = require("../models/comentsOfPost");
const csrf_1 = __importDefault(require("csrf"));
const uuidv4_1 = require("uuidv4");
const sequelize_1 = require("sequelize");
const { PAGE_PAGINATION } = require('../constants');
exports.apiV1Route = (0, express_1.Router)({});
let countAllItemsInTodoList = 0;
let countAllComents = 0;
/*create COMENT for Post*/
exports.apiV1Route.post('/commit', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({ error: 'forbidden' });
    }
    try {
        /*hook*/
        const amountAll = yield comentsOfPost_1.commitModel.count({
            where: {
                id: {
                    [sequelize_1.Op.gt]: 0
                }
            }
        });
        countAllComents = amountAll;
        const commitItem = yield comentsOfPost_1.commitModel.create({
            id: ++countAllComents,
            text: req.body.text,
            parentUuid: req.body.parentUuid
        });
        res.status(201).send(commitItem);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}));
/*getAll*/
exports.apiV1Route.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.isAuthenticated)
        return res.send({ error: 'forbidden' });
    const tokens = new csrf_1.default();
    let tokenSentToFront;
    const secret = req.session.secretForCustomer;
    if (secret)
        tokenSentToFront = yield tokens.create(secret);
    let reqCurrentPage = req.query.action;
    if (typeof reqCurrentPage !== 'string')
        reqCurrentPage = '1';
    try {
        /*calculating all*/
        const amountAll = yield postsModel_1.postsModel.count({
            where: {
                id: {
                    [sequelize_1.Op.gt]: 0
                }
            }
        });
        countAllItemsInTodoList = amountAll;
        let offset = amountAll - (parseInt(reqCurrentPage) * PAGE_PAGINATION);
        let limit = offset < 0 ? PAGE_PAGINATION + offset : PAGE_PAGINATION;
        offset = offset < 0 ? 0 : offset;
        const rows = yield postsModel_1.postsModel.findAll({
            limit: limit,
            offset: offset,
        });
        res.send({
            items: rows,
            loginOfCurrentUser: req.session.customer[0].login,
            '_csrf': tokenSentToFront,
            amountPage: Math.ceil(amountAll / PAGE_PAGINATION)
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}));
/*getAll for only Current User*/
exports.apiV1Route.get('/my', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.isAuthenticated)
        return res.send({ error: 'forbidden' });
    try {
        const allTodos = yield postsModel_1.postsModel.findAll({
            where: {
                login: req.session.customer[0].login
            },
        });
        res.send({ items: allTodos });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}));
/*create new Post*/
exports.apiV1Route.post('/', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({ error: 'forbidden' });
    }
    try {
        const todoItem = postsModel_1.postsModel.build({
            id: ++countAllItemsInTodoList,
            checked: req.body.done === 'true',
            text: req.body.text,
            login: req.session.customer[0].login,
            userName: req.session.customer[0].userName,
            face: req.session.customer[0].face,
            uuid: (0, uuidv4_1.uuid)(),
        });
        yield todoItem.save();
        res.status(201).send(todoItem);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}));
/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
exports.apiV1Route.put('/', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), (0, validator_1.idValid)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postIsChanging = yield postsModel_1.postsModel.findByPk(+req.body.id);
        /*ckeking if curent user make changing*/
        if (postIsChanging && postIsChanging.login === req.session.customer[0].login) {
            postIsChanging.text = req.body.text;
            postIsChanging.checked = !!req.body.checked;
            postIsChanging.save();
            res.status(201).send({ 'ok': true });
        }
        else {
            res.send({ 'bad': false });
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(409);
    }
}));
/* deleteTask */
exports.apiV1Route.delete('/', (0, validator_1.idValid)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const deleteTodoItem = yield postsModel_1.postsModel.findAll({
            where: {
                id: +req.body.id
            }
        });
        (_a = deleteTodoItem[0]) === null || _a === void 0 ? void 0 : _a.destroy();
        res.status(200).send({ 'ok': true });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400).send({ 'bad': false });
    }
}));
//# sourceMappingURL=api_V1_route.js.map