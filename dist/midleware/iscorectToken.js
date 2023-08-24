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
    console.log('token-', token);
    console.log('req.session.secretForCustomer-', req.session.secretForCustomer);
    const isCorect = tokens.verify(req.session.secretForCustomer, token);
    if (!isCorect) {
        res.status(405);
    }
    else
        next();
}
exports.isCorrectToken = isCorrectToken;
//# sourceMappingURL=iscorectToken.js.map