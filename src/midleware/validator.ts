import {body,query, validationResult} from 'express-validator'
import {NextFunction, Request, Response} from "express";

export function urlValidMiddleware() {
    return query('person').isLength({min: 3, max: 10}).escape().withMessage("Query should be 3 ");
}
export function textValidMiddleware() {
    return body('text').trim().isLength({min: 3, max: 10}).escape().withMessage("Min length should be 3");
}

export function emailValidMiddleware() {
    return body('email').isEmail().withMessage("Email should be email");
}


export function checkValidationInMiddleWare(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (errors.isEmpty()) next();
    else {
        res.status(422).send({errors: errors.array()});
    }
}