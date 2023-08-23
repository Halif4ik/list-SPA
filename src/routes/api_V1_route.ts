import {Request, Response, Router} from "express";
import {productsRepository} from "../repositories/products-repository";
import {checkValidationInMiddleWare,textValidMiddleware} from "../midleware/validator";

export const apiV1Route = Router({});

/*http://localhost:3001/api/v1/items?action=*/

apiV1Route.get('/items', (req: Request, res: Response) => {
    const reqParamItems: string = req.params.ID;
    const action: string | any = req.query.action;
    const products = productsRepository.getAllProd();

    products ? res.send({items: products}) : res.sendStatus(404)
});

apiV1Route.post('/items',   (req: Request, res: Response) => {
    /*const autorHeders: string | undefined = req.headers.authorization;
    if (autorHeders) {
        const cutAuth = autorHeders.substring(autorHeders.indexOf(' ') + 1);
        console.log('cutAuth-', cutAuth);
        console.log(cutAuth === 'aGFsbDoxMjM=');
    }*/

    console.log('text-',req.body.text);
    console.log('body-',req.body);

    const newIdTask = productsRepository.createProduct(req.body.text);
    newIdTask ? res.status(201).send(newIdTask) : res.sendStatus(404)
});

/*

apiV1Route.delete('/:ID', (req: Request, res: Response) => {
    const uriProdID: string = req.params.ID;
    const findedProduct = productsRepository.deleteProduct(+uriProdID);
    findedProduct ? res.status(204).send(findedProduct) : res.sendStatus(404)
})

apiV1Route.put('/:ID', textValidMiddleware(), (req: Request, res: Response) => {
    const iDFromReqParams: string = req.params.ID;
    const titleInBody: string = req.body.title;
    const isUpdated = productsRepository.updateProduct(titleInBody, +iDFromReqParams)
    if (isUpdated) {
        const updatedProd = productsRepository.findByTitle(iDFromReqParams);
        res.status(204).send(updatedProd);
    } else res.sendStatus(404);
})
*/

