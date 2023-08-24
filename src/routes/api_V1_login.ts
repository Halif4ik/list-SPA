import {Request, Response, Router} from "express";
import {
    checkValidationInMiddleWare,
    emailValidMiddleware,
    passwordValidInBodyMiddleware,
} from "../midleware/validator";
import Tokens from 'csrf';
import {CustomerModel} from "../models/customerModel";

const {SEND_GRID_API_KEY, BASE_URL, HOST_EMAIL} = require('../constants');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
export const apiV1LoginRegisRoute = Router({});

const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: SEND_GRID_API_KEY,
    }
}));

/*Login*/
apiV1LoginRegisRoute.post('/login', emailValidMiddleware(), passwordValidInBodyMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    /*const autorHeders: string | undefined = req.headers.authorization;
    if (autorHeders) {
        const cutAuth = autorHeders.substring(autorHeders.indexOf(' ') + 1);
        console.log('cutAuth-', cutAuth);
        console.log(cutAuth === 'aGFsbDoxMjM=');
    }*/
    try {
        const {login, pass} = req.body;
        const registeredCustomer = await CustomerModel.findAll({
            where: {
                login: login
            }
        });

        if (!registeredCustomer.length) return res.send({errors: [{"msg": "Wrong e-mail",}]});
        const isPass = await bcrypt.compare(pass, registeredCustomer[0].dataValues.pass);

        if (isPass) {
            req.session.customer = registeredCustomer;
            req.session.isAuthenticated = true;
            req.session.secretForCustomer = registeredCustomer[0].dataValues.csrf;

            const tokens: Tokens = new Tokens();
            const secret = req.session.secretForCustomer;
            const tokenSentToFront = await tokens.create(secret);

            req.session.save(err => {
                if (err) {
                    console.log('Error with login user-', err);
                    throw err;
                }
                res.status(200).send({'ok': true, '_csrf': tokenSentToFront} as IResult);
            });
        } else {
            return res.send({error: 'not found'});
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(400).send({'bad': false} as IResult)
    }

});
/*logout*/
apiV1LoginRegisRoute.post('/logout', async (req: Request, res: Response) => {
    try {
        const registeredCustomer = req.session.customer;
        console.log('deleteTodoItem---', registeredCustomer);
        if (!registeredCustomer.length) return res.send({errors: [{"msg": "Wrong Logout",}]});
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
            res.status(200).send({'ok': true} as IResult);
        });

    } catch (e) {
        console.log(e);
        res.sendStatus(400).send({'bad': false} as IResult)
    }

});

/*register*/
apiV1LoginRegisRoute.post('/register', emailValidMiddleware(), passwordValidInBodyMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
        const {login, pass} = req.body;
        const registeredCustomer = await CustomerModel.findAll({
            where: {
                login: login
            }
        });
        if (registeredCustomer.length) {
            res.send({errors: [{"msg": "This e-mail is already register",}]});
            return;
        }
        /*create secret kay and token for hidden filds in forms*/
        const tokens: Tokens = new Tokens();
        const secretForCustomer: string = await tokens.secret();

        try {
            await CustomerModel.create({login, pass: await bcrypt.hash(pass, 10), csrf: secretForCustomer});

            await mailer.sendMail({
                to: [login],
                from: HOST_EMAIL,
                subject: `You  are registered on SPA todo-List`,
                text: `Lorem ipsum dolor sit amet.`,
                html: `<h1>Thanks very match!</h1>
                    <p> You created account with this email- ${login}</p>
                    <hr/>
                    <a href="${BASE_URL}">Our SPA toto-list</a>`
            }, function (err, res) {
                if (err) console.log('errSendMail-', err)
            });
            res.status(200).send({'ok': true} as IResult);
        } catch (e) {
            console.log('!!!-', e);
        }
    }
);

interface IResult {
    [key: string]: boolean
    [key: string]: string
}


