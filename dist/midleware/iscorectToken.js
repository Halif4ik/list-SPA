"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCorrectToken = void 0;
const csrf_1 = __importDefault(require("csrf"));
function isCorrectToken(req, res, next) {
    const _csrfToken = req.body._csrf;
    const XSRF = req.headers['x-xcsrf'];
    const token = _csrfToken ? _csrfToken : XSRF;
    const tokens = new csrf_1.default();
    /* console.log('token.body-',req.body);
     console.log('req.session.secretForCustomer-',req.session.secretForCustomer);*/
    if (!req.session.secretForCustomer || !tokens.verify(req.session.secretForCustomer, token)) {
        res.status(405).send({ errors: [{ msg: 'bad tokens csrf' }] });
    }
    else
        next();
}
exports.isCorrectToken = isCorrectToken;
//# sourceMappingURL=iscorectToken.js.map