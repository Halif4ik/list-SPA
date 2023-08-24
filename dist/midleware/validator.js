"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidationInMiddleWare = exports.passwordValidInBodyMiddleware = exports.emailValidMiddleware = exports.textValidMiddleware = exports.idValid = void 0;
const express_validator_1 = require("express-validator");
function idValid() {
    return (0, express_validator_1.body)('id').trim().isLength({ min: 1, max: 50 }).isNumeric().withMessage("Id should be Number");
}
exports.idValid = idValid;
function textValidMiddleware() {
    return (0, express_validator_1.body)('text').trim().isLength({ min: 3, max: 50 }).escape().withMessage("Length text field should be 3-50");
}
exports.textValidMiddleware = textValidMiddleware;
function emailValidMiddleware() {
    return (0, express_validator_1.body)('login').isEmail().withMessage("Email should be email");
}
exports.emailValidMiddleware = emailValidMiddleware;
function passwordValidInBodyMiddleware() {
    return (0, express_validator_1.body)('pass', "Password should has characters or numbers should be longer 5 and less 20").trim().isLength({
        min: 6,
        max: 20
    });
}
exports.passwordValidInBodyMiddleware = passwordValidInBodyMiddleware;
function checkValidationInMiddleWare(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        next();
    else {
        res.status(422).send({ errors: errors.array() });
    }
}
exports.checkValidationInMiddleWare = checkValidationInMiddleWare;
//# sourceMappingURL=validator.js.map