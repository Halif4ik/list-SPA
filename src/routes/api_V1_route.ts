import {Request, Response, Router} from "express";
import {checkValidationInMiddleWare, idValid, textValidMiddleware} from "../midleware/validator";
import {isCorrectToken} from "../midleware/iscorectToken";
import {Post, PostInstance} from "../models/post";
import Commit from "../models/Commits";
import Customer from "../models/customer";
import Tokens from "csrf";
import {uuid} from 'uuidv4';
import {Op} from "sequelize";

const {PAGE_PAGINATION} = require('../constants');

export const apiV1Route = Router({});
let countAllItemsInTodoList = 0;
let countAllComents = 0;

/*create COMENT for Post*/
apiV1Route.post('/commit', isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    try {
        const curCustomer = await Customer.findOne({
            where: {
                id: {
                    [Op.eq]: req.session.customer[0].id
                }
            }
        });

        /*old hook*/
        const amountAll: number = await Commit.count({
            where: {
                id: {
                    [Op.gt]: 0
                }
            }
        });
        countAllComents = amountAll;
        const commitItem = new Commit({
            id: ++countAllComents,
            customer_id: req.session.customer[0].id,
            text: req.body.text,
            parentUuid: req.body.parentUuid
        })
        await commitItem.save();
        /**/

        await Commit.bulkCreate([{
            customer_id: req.session.customer[0].id,
            text: req.body.text,
            parentUuid: req.body.parentUuid
        }])

        console.log('********', await curCustomer.getCommits());
         console.log('////!***', await curCustomer.findAll({
             where: {},
             include: [{
                 association: 'Commits',
             }]
         }));

        res.status(201).send(commitItem);
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
        const amountAll: number = await Post.count({
            where: {
                id: {
                    [Op.gt]: 0
                }
            }
        });
        countAllItemsInTodoList = amountAll;

        let offset: number = amountAll - (parseInt(reqCurrentPage) * PAGE_PAGINATION);
        let limit = offset < 0 ? PAGE_PAGINATION + offset : PAGE_PAGINATION;
        offset = offset < 0 ? 0 : offset;

        const rows: PostInstance[] = await Post.findAll({
            limit: limit,
            offset: offset,
        });
        /*get commit*/

        console.log('rows0000-', rows[0] && rows[0]["text"]);

        res.send({
            items: rows,
            loginOfCurrentUser: req.session.customer[0].login,
            '_csrf': tokenSentToFront,
            amountPage: Math.ceil(amountAll / PAGE_PAGINATION)
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});
/*getAll for only Current User*/
apiV1Route.get('/my', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) return res.send({error: 'forbidden'});
    try {
        const allTodos: PostInstance[] = await Post.findAll({
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
    try {
        const todoItem: PostInstance = Post.build({
            id: ++countAllItemsInTodoList,
            checked: req.body.done === 'true',
            text: req.body.text,
            login: req.session.customer[0].login,
            userName: req.session.customer[0].userName,
            face: req.session.customer[0].face,
            uuid: uuid(),
        });
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
        const postIsChanging: PostInstance | null = await Post.findByPk(+req.body.id);
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
        const deleteTodoItem: PostInstance[] = await Post.findAll({
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


