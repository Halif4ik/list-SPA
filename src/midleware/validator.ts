import {body,query, validationResult} from 'express-validator'
import {NextFunction, Request, Response} from "express";

export function idValid() {
    return body('id').trim().isLength({min:1, max: 50}).isNumeric().withMessage("Id should be Number");
}
export function textValidMiddleware() {
    return body('text').trim().isLength({min: 3, max: 50}).escape().withMessage("Length text field should be 3-50");
}

export function emailValidMiddleware() {
    return body('login').isEmail().withMessage("Email should be email");
}

export function passwordValidInBodyMiddleware () {
    return body('pass', "Password should has characters or numbers should be longer 5 and less 20").trim().isLength({
        min: 6,
        max: 20
    });
}

export function checkValidationInMiddleWare(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (errors.isEmpty()) next();
    else {
        res.status(422).send({errors: errors.array()});
    }
}