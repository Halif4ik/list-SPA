import Tokens from 'csrf';
import {NextFunction, Request, Response} from "express";
export function isCorrectToken(req: Request, res: Response, next: NextFunction) {
    const _csrfToken = req.body._csrf;
    const XSRF:string | string[] | undefined = req.headers['x-xcsrf'];
    const token = _csrfToken ? _csrfToken : XSRF;

    const tokens:Tokens = new Tokens();
   /*console.log('token-',token);
    console.log('req.session.secretForCustomer-',req.session.secretForCustomer);
    console.log('session-',req.session);*/

    const isCorect:boolean = tokens.verify(req.session.secretForCustomer, token);

    if (!isCorect) {
        res.status(405);
    } else next();
}

