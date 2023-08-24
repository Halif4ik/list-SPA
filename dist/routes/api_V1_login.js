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
exports.apiV1LoginRegisRoute = void 0;
const express_1 = require("express");
const validator_1 = require("../midleware/validator");
const csrf_1 = __importDefault(require("csrf"));
const customerModel_1 = require("../models/customerModel");
const { SEND_GRID_API_KEY, BASE_URL, HOST_EMAIL } = require('../constants');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
exports.apiV1LoginRegisRoute = (0, express_1.Router)({});
const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: SEND_GRID_API_KEY,
    }
}));
/*Login*/
exports.apiV1LoginRegisRoute.post('/login', (0, validator_1.emailValidMiddleware)(), (0, validator_1.passwordValidInBodyMiddleware)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*const autorHeders: string | undefined = req.headers.authorization;
    if (autorHeders) {
        const cutAuth = autorHeders.substring(autorHeders.indexOf(' ') + 1);
        console.log('cutAuth-', cutAuth);
        console.log(cutAuth === 'aGFsbDoxMjM=');
    }*/
    try {
        const { login, pass } = req.body;
        const registeredCustomer = yield customerModel_1.CustomerModel.findAll({
            where: {
                login: login
            }
        });
        if (!registeredCustomer.length)
            return res.send({ errors: [{ "msg": "Wrong e-mail", }] });
        const isPass = yield bcrypt.compare(pass, registeredCustomer[0].dataValues.pass);
        if (isPass) {
            req.session.customer = registeredCustomer;
            req.session.isAuthenticated = true;
            req.session.secretForCustomer = registeredCustomer[0].dataValues.csrf;
            const tokens = new csrf_1.default();
            const secret = req.session.secretForCustomer;
            const tokenSentToFront = yield tokens.create(secret);
            req.session.save(err => {
                if (err) {
                    console.log('Error with login user-', err);
                    throw err;
                }
                res.status(200).send({ 'ok': true, '_csrf': tokenSentToFront });
            });
        }
        else {
            return res.send({ error: 'not found' });
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400).send({ 'bad': false });
    }
}));
/*logout*/
exports.apiV1LoginRegisRoute.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registeredCustomer = req.session.customer;
        console.log('deleteTodoItem---', registeredCustomer);
        if (!registeredCustomer.length)
            return res.send({ errors: [{ "msg": "Wrong Logout", }] });
        else {
            /* const deleteTodoItem = await CustomerModel.findAll({
                 where: {
                     login: registeredCustomer[0].login
                 }
             });
            deleteTodoItem[0]?.destroy();*/
            req.session.isAuthenticated = false;
            req.session.secretForCustomer = '';
        }
        req.session.save(err => {
            if (err) {
                console.log('Error with login user-', err);
                throw err;
            }
            res.status(200).send({ 'ok': true });
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400).send({ 'bad': false });
    }
}));
/*register*/
exports.apiV1LoginRegisRoute.post('/register', (0, validator_1.emailValidMiddleware)(), (0, validator_1.passwordValidInBodyMiddleware)(), validator_1.checkValidationInMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, pass } = req.body;
    const registeredCustomer = yield customerModel_1.CustomerModel.findAll({
        where: {
            login: login
        }
    });
    if (registeredCustomer.length) {
        res.send({ errors: [{ "msg": "This e-mail is already register", }] });
        return;
    }
    /*create secret kay and token for hidden filds in forms*/
    const tokens = new csrf_1.default();
    const secretForCustomer = yield tokens.secret();
    try {
        yield customerModel_1.CustomerModel.create({ login, pass: yield bcrypt.hash(pass, 10), csrf: secretForCustomer });
        yield mailer.sendMail({
            to: [login],
            from: HOST_EMAIL,
            subject: `You  are registered on SPA todo-List`,
            text: `Lorem ipsum dolor sit amet.`,
            html: `<h1>Thanks very match!</h1>
                    <p> You created account with this email- ${login}</p>
                    <hr/>
                    <a href="${BASE_URL}">Our SPA toto-list</a>`
        }, function (err, res) {
            if (err)
                console.log('errSendMail-', err);
        });
        res.status(200).send({ 'ok': true });
    }
    catch (e) {
        console.log('!!!-', e);
    }
}));
//# sourceMappingURL=api_V1_login.js.map