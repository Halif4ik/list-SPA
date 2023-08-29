"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoute = void 0;
const express_1 = require("express");
const products_repository_1 = require("../repositories/products-repository");
const validator_1 = require("../midleware/validator");
exports.productsRoute = (0, express_1.Router)({});
exports.productsRoute.post('/', (0, validator_1.textValidMiddleware)(), (0, validator_1.emailValidMiddleware)(), validator_1.checkValidationInMiddleWare, (req, res) => {
    const autorHeders = req.headers.authorization;
    if (autorHeders) {
        const cutAuth = autorHeders.substring(autorHeders.indexOf(' ') + 1);
        console.log('cutAuth-', cutAuth);
        console.log(cutAuth === 'aGFsbDoxMjM=');
    }
    const title = req.body.title;
    const email = req.body.email;
    const newProd = products_repository_1.productsRepository.createProduct(title, email);
    newProd ? res.status(201).send(newProd) : res.sendStatus(404);
});
exports.productsRoute.get('/', (req, res) => {
    const title = req.query.title;
    const foundProd = products_repository_1.productsRepository.findByTitle(title);
    foundProd ? res.send(foundProd) : res.sendStatus(404);
});
exports.productsRoute.get('/:ID', (req, res) => {
    const reqProdID = req.params.ID;
    const foundProd = products_repository_1.productsRepository.getProdBiId(+reqProdID);
    foundProd ? res.send(foundProd) : res.sendStatus(404);
});
exports.productsRoute.delete('/:ID', (req, res) => {
    const uriProdID = req.params.ID;
    const findedProduct = products_repository_1.productsRepository.deleteProduct(+uriProdID);
    findedProduct ? res.status(204).send(findedProduct) : res.sendStatus(404);
});
exports.productsRoute.put('/:ID', (0, validator_1.textValidMiddleware)(), (req, res) => {
    const iDFromReqParams = req.params.ID;
    const titleInBody = req.body.title;
    const isUpdated = products_repository_1.productsRepository.updateProduct(titleInBody, +iDFromReqParams);
    if (isUpdated) {
        const updatedProd = products_repository_1.productsRepository.findByTitle(iDFromReqParams);
        res.status(204).send(updatedProd);
    }
    else
        res.sendStatus(404);
});
