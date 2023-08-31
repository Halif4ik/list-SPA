import {Request, Response, Router} from "express";
import {checkValidationInMiddleWare, idValid, textValidMiddleware} from "../midleware/validator";
import {isCorrectToken} from "../midleware/iscorectToken";
import {TodoInstance, postsModel,comentModel} from "../models/postsModel";
import Tokens from "csrf";
import {Op} from "sequelize";
import {ComentsInstance} from "../models/comentsOfPost";

const {PAGE_PAGINATION} = require('../constants');

export const apiV1Route = Router({});
let countAllItemsInTodoList = 0;

/*create COMENT for Post*/
apiV1Route.post('/', isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    console.log('!!!apiV1Route-')
    try {
        const todoItem: ComentsInstance = comentModel.build({
            text: req.body.text,
            login: req.session.customer[0].login
        });
        console.log('!!!!!!!todoItem-', todoItem);

        await todoItem.save();
        res.status(201).send(todoItem);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});

/*getAll*/
apiV1Route.get('/', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) return res.send({error: 'forbidden'});
    const tokens: Tokens = new Tokens();
    let tokenSentToFront;
    const secret: string | undefined = req.session.secretForCustomer;
    if (secret) tokenSentToFront = await tokens.create(secret);

    let reqCurrentPage: string | any = req.query.action;
    if (typeof reqCurrentPage !== 'string') reqCurrentPage = '1'

    try {
        /*calculating all*/
        const amountAll:number = await postsModel.count({
            where: {
                id: {
                    [Op.gt]: 0
                }
            }
        });
        countAllItemsInTodoList = amountAll;

        let offset:number = amountAll - (parseInt(reqCurrentPage) * PAGE_PAGINATION);
        let limit =  offset < 0 ? PAGE_PAGINATION + offset : PAGE_PAGINATION;
        offset =  offset < 0 ? 0 : offset;

        const rows = await postsModel.findAll({
            limit: limit,
            offset: offset,
        });

        res.send({items: rows, '_csrf': tokenSentToFront, amountPage:Math.ceil(amountAll/PAGE_PAGINATION)});
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});
/*getAll for only Current User*/
apiV1Route.get('/my', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) return res.send({error: 'forbidden'});
    try {
        const allTodos = await postsModel.findAll({
            where: {
                login: req.session.customer[0].login
            },
        });
        res.send({items: allTodos});
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});
/*create new Post*/
apiV1Route.post('/', isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    console.log('!!!apiV1Route-')
    try {
        const todoItem: TodoInstance = postsModel.build({
            id: ++countAllItemsInTodoList,
            checked: req.body.done === 'true',
            text: req.body.text,
            login: req.session.customer[0].login
            userName: req.session.customer[0].userName
            face: req.session.customer[0].face
        });
        console.log('!!!!!!!todoItem-', todoItem);

        await todoItem.save();
        res.status(201).send(todoItem);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});

/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
apiV1Route.put('/', isCorrectToken, textValidMiddleware(), idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const postIsChanging: TodoInstance | null = await postsModel.findByPk(+req.body.id);
        /*ckeking if curent user make changing*/
        if (postIsChanging && postIsChanging.login === req.session.customer[0].login) {
            postIsChanging.text = req.body.text;
            postIsChanging.checked = !!req.body.checked
            postIsChanging.save();
            res.status(201).send({'ok': true} as IResult);
        } else {
            res.send({'bad': false} as IResult)
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(409)
    }


})
/* deleteTask */
apiV1Route.delete('/', idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const deleteTodoItem: TodoInstance[] = await postsModel.findAll({
            where: {
                id: +req.body.id
            }
        });
        deleteTodoItem[0]?.destroy();
        res.status(200).send({'ok': true} as IResult);
    } catch (e) {
        console.log(e);
        res.sendStatus(400).send({'bad': false} as IResult)
    }
})

interface IResult {
    [key: string]: boolean
}


