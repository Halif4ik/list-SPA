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
const Commits_1 = __importDefault(require("../models/Commits"));
const customer_1 = __importDefault(require("../models/customer"));
const post_1 = __importDefault(require("../models/post"));
const csrf_1 = __importDefault(require("csrf"));
const sequelize_1 = require("sequelize");
const { PAGE_PAGINATION } = require('../constants');
exports.apiV1Route = (0, express_1.Router)({});
/*create COMENT for Post*/
exports.apiV1Route.post('/commit', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({ error: 'forbidden' });
    }
    try {
        const commitItem = yield Commits_1.default.bulkCreate([{
                customer_id: req.session.customer[0].id,
                text: req.body.text,
                post_id: req.body.post_id
            }]);
        const rows = yield customer_1.default.findAll({
            where: {
                id: req.session.customer[0].id,
            },
            include: [{
                    association: 'Posts',
                }],
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
    let reqCurrentPage = req.query.page;
    if (isNaN(parseInt(reqCurrentPage)))
        reqCurrentPage = '1';
    const revert = req.query.revert;
    const order = revert === 'true' ? 'ASC' : 'DESC';
    try {
        /*calculating all*/
        const amountAll = yield post_1.default.count({
            where: {
                id: {
                    [sequelize_1.Op.gt]: 0
                }
            }
        });
        const posts = yield post_1.default.findAll({
            where: {},
            include: [{
                    association: 'Commits',
                }],
            order: [
                ['id', order],
            ],
            limit: PAGE_PAGINATION,
            offset: PAGE_PAGINATION * (parseInt(reqCurrentPage) - 1),
        });
        /*kostil add user info in answer*/
        for (const onePost of posts) {
            const Commits = onePost['Commits'];
            for (const currentCommit of Commits) {
                const customerWichMakeCommit = currentCommit === null || currentCommit === void 0 ? void 0 : currentCommit.customer_id;
                const customerInfo = yield customer_1.default.findAll({
                    where: {
                        id: customerWichMakeCommit,
                    },
                });
                currentCommit.dataValues['customerInfo'] = {
                    userName: customerInfo[0].dataValues.userName,
                    face: customerInfo[0].dataValues.face,
                };
            }
        }
        res.send({
            items: posts,
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
    let reqCurrentPage = req.query.page;
    if (isNaN(parseInt(reqCurrentPage)))
        reqCurrentPage = '1';
    const reqRevert = req.query.revert;
    const order = reqRevert === 'true' ? 'ASC' : 'DESC';
    try {
        const myPosts = yield post_1.default.findAll({
            where: {
                login: req.session.customer[0].login
            },
            include: [{
                    association: 'Commits',
                }],
            order: [
                ['createdAt', order],
            ],
            limit: PAGE_PAGINATION,
            offset: PAGE_PAGINATION * (parseInt(reqCurrentPage) - 1),
        });
        /*kostil add user info in answer*/
        for (const onePost of myPosts) {
            const Commits = onePost['Commits'];
            for (const currentCommit of Commits) {
                const customerWichMakeCommit = currentCommit === null || currentCommit === void 0 ? void 0 : currentCommit.customer_id;
                const customerInfo = yield customer_1.default.findAll({
                    where: {
                        id: customerWichMakeCommit,
                    },
                });
                currentCommit.dataValues['customerInfo'] = {
                    userName: customerInfo[0].dataValues.userName,
                    face: customerInfo[0].dataValues.face,
                };
            }
        }
        res.send({ items: myPosts });
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
        const postItem = yield post_1.default.bulkCreate([{
                checked: req.body.done === 'true',
                text: req.body.text,
                customer_id: req.session.customer[0].id,
                login: req.session.customer[0].login,
                userName: req.session.customer[0].userName,
                face: req.session.customer[0].face,
            }]);
        res.status(201).send(postItem[0]);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
}));
/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
exports.apiV1Route.put('/', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), (0, validator_1.idValid)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postIsChanging = yield post_1.default.findByPk(+req.body.id);
        if (postIsChanging) {
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
        const deleteTodoItem = yield post_1.default.findAll({
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
    /*let curCustomer: Customer | null = await Customer.findOne({
            where: {
                id: {
                    [Op.eq]: req.session.customer[0].id
                }
            }
        });
       console.log('********', await curCustomer.getCommits());*/
}));
//# sourceMappingURL=api_V1_route.js.map