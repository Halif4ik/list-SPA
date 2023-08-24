import {Request, Response, Router} from "express";
export const apiV1Route = Router({});
import {checkValidationInMiddleWare, textValidMiddleware,idValid} from "../midleware/validator";
import {productsRepository} from "../repositories/products-repository";

import {todoModel} from "../models/todoModel";
import {Sequelize} from 'sequelize'

/*http://localhost:3001/api/v1/items?action=*/
apiV1Route.get('/', (req: Request, res: Response) => {
    const reqParamItems: string = req.params.ID;
    const action: string | any = req.query.action;
    const products = productsRepository.getAllProd();

    products ? res.send({items: products}) : res.sendStatus(404)
});

apiV1Route.post('/', textValidMiddleware(), checkValidationInMiddleWare, (req: Request, res: Response) => {
    /*const autorHeders: string | undefined = req.headers.authorization;
    if (autorHeders) {
        const cutAuth = autorHeders.substring(autorHeders.indexOf(' ') + 1);
        console.log('cutAuth-', cutAuth);
        console.log(cutAuth === 'aGFsbDoxMjM=');
    }*/
    const newTaskText = productsRepository.createProduct(req.body.text);
    newTaskText ? res.status(201).send(newTaskText) : res.sendStatus(404)
});

apiV1Route.delete('/',idValid(), checkValidationInMiddleWare, (req: Request, res: Response) => {
    const findedProduct = productsRepository.deleteProduct(+req.body.id);
    findedProduct ? res.status(201).send({'ok': true} as IResult) : res.sendStatus(204).send({'bad': false} as IResult)
})

apiV1Route.put('/',textValidMiddleware(),idValid(), checkValidationInMiddleWare, (req: Request, res: Response) => {
    const isUpdated = productsRepository.updateProduct(req.body.text, +req.body.id, req.body.checked === 'true')
    isUpdated ? res.status(201).send({'ok': true} as IResult) : res.sendStatus(204).send({'bad': false} as IResult)

})

interface IResult {
    [key: string]: boolean
}


