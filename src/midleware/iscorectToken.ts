import Tokens from 'csrf';
import {NextFunction, Request, Response} from "express";
export function isCorrectToken(req: Request, res: Response, next: NextFunction) {
    const _csrfToken = req.body._csrf;
    const XSRF:string | string[] | undefined = req.headers['x-xcsrf'];
    const token = _csrfToken ? _csrfToken : XSRF;

    const tokens:Tokens = new Tokens();
    /*console.log('token.body-',req.body);
    console.log('req.session.secretForCustomer-',req.session.secretForCustomer);*/

    if (!req.session.secretForCustomer || !tokens.verify(req.session.secretForCustomer, token)) {
        res.status(405).send({errors: [{msg:'bad tokens csrf'}]});
    } else next();
}

