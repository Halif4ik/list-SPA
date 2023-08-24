import Tokens from 'csrf';
import {NextFunction, Request, Response} from "express";
export function isCorrectToken(req: Request, res: Response, next: NextFunction) {
    const _csrfToken = req.body._csrf;
    const XSRF = req.headers['x-xcsrf'];
    const token = _csrfToken ? _csrfToken : XSRF;

    const tokens = new Tokens();
    console.log('token-',token);
    console.log('req.session.secretForCustomer-',req.session.secretForCustomer);

    const isCorect = tokens.verify(req.session.secretForCustomer, token);

    if (!isCorect) {
        res.status(405);
    } else next();
}

