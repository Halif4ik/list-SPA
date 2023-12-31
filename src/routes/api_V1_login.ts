import express, {Request, Response} from 'express';
import {
    checkValidationInMiddleWare,
    emailValidMiddleware,
    homePValid,
    passwordValidInBodyMiddleware,
} from "../midleware/validator";
import Tokens from 'csrf';
import {Commit,Post,Customer} from '../models/modelsDb';
/*import {bcrypt} from 'bcryptjs';*/
const bcrypt = require('bcryptjs');
const router = express.Router();

const {SEND_GRID_API_KEY, BASE_URL, HOST_EMAIL} = require('../const.dev');

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: SEND_GRID_API_KEY,
    }
}));
let arrHexsFaces = ['👩‍🦰'.codePointAt(0), '👨‍🦲'.codePointAt(0), '👲'.codePointAt(0), `👧`.codePointAt(0)];

/*Login*/
router.post('/login', emailValidMiddleware(), passwordValidInBodyMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const {login, pass} = req.body;
        const registeredCustomer = await Customer.findAll({
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
            req.session.face = registeredCustomer[0].dataValues.face;

            const tokens: Tokens = new Tokens();
            const secret: string | undefined = req.session.secretForCustomer;
            const tokenSentToFront = await tokens.create(secret);

            req.session.save(err => {
                if (err) {
                    console.log('Error with login user-', err);
                    throw err;
                }
                res.status(200).send({'ok': true, '_csrf': tokenSentToFront});
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
router.post('/logout', async (req: Request, res: Response) => {
    try {
        const registeredCustomer = req.session.customer
        /*console.log('!!instanceof---',  req.session.customer instanceof (Model<CustomerModelStatic>));*/
        if (!registeredCustomer || !registeredCustomer.length) return res.send({errors: [{"msg": "Wrong Logout",}]});
        else {
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
router.post('/register', emailValidMiddleware(), passwordValidInBodyMiddleware(), homePValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
        const {login, pass, userName, homePage} = req.body;
        const registeredCustomer = await Customer.findAll({
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
            const emoji = arrHexsFaces[Math.floor(Math.random() * (arrHexsFaces.length - 1))];
            await Customer.create({
                login,
                userName,
                homePage,
                face: emoji,
                pass: await bcrypt.hash(pass, 10),
                csrf: secretForCustomer
            });
            /*todo mailer upgrate plan*/
           /* await mailer.sendMail({
                to: [login],
                from: HOST_EMAIL,
                subject: `Hi ${userName} you  are registered on SPA todo-List`,
                text: `Lorem ipsum dolor sit amet.`,
                html: `<h1>Thanks very match!</h1>
                    <p> You created account with this email- ${login}</p>
                    <hr/>
                    <a href="${BASE_URL}">Our SPA toto-list</a>`
            }, function (err: Request, res: Response): void {
                if (err) console.log('errSendMail-', err)
            });*/

            res.status(200).send({'ok': true} as IResult);
        } catch (e) {
            console.log('!!!-', e);
        }
    }
);

interface IResult {
    [key: string]: boolean
}

export {router as apiV1LoginRegisRoute};

