import {Request, Response, Router} from "express";
import {checkValidationInMiddleWare, idValid, textValidMiddleware} from "../midleware/validator";
import {isCorrectToken} from "../midleware/iscorectToken";
import Commit from "../models/Commits";
import Customer from "../models/customer";
import Post from "../models/post";
import Tokens from "csrf";
import {Op} from "sequelize";

const {PAGE_PAGINATION} = require('../constants');

export const apiV1Route = Router({});

/*create COMENT for Post*/
apiV1Route.post('/commit', isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    try {
        /*let curCustomer: Customer | null = await Customer.findOne({
            where: {
                id: {
                    [Op.eq]: req.session.customer[0].id
                }
            }
        });
        console.log('++++++++', await curCustomer.getPosts());
       console.log('********', await curCustomer.getCommits());*/
        const commitItem: Commit = await Commit.bulkCreate([{
            customer_id: req.session.customer[0].id,
            text: req.body.text,
            post_id: req.body.post_id
        }])

        const rows = await Customer.findAll({
            where: {
                id: req.session.customer[0].id,
            },
            include: [{
                association: 'Posts',
            }],
        });
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
        let offset: number = amountAll - (parseInt(reqCurrentPage) * PAGE_PAGINATION);
        let limit = offset < 0 ? PAGE_PAGINATION + offset : PAGE_PAGINATION;
        offset = offset < 0 ? 0 : offset;
        console.log('before-');
        const posts = await Post.findAll({
            where: {},
            include: [{
                association: 'Commits',
            }],
            limit: limit,
            offset: offset,
        });

        /*kostil add user info in answer*/
        for (const onePost of posts) {
            const Commits = onePost['Commits'];
            for (const currentCommit of Commits) {
                const customerWichMakeCommit = currentCommit?.customer_id;
                const customerInfo = await Customer.findAll({
                    where: {
                        id: customerWichMakeCommit,
                    },
                })
                currentCommit.dataValues['customerInfo'] = {
                    userName: customerInfo[0].dataValues.userName,
                    face: customerInfo[0].dataValues.face,
                }
            }
        }


        res.send({
            items: posts,
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
        const allTodos = await Post.findAll({
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
        const postItem: Post[] = await Post.bulkCreate([{
            checked: req.body.done === 'true',
            text: req.body.text,
            customer_id: req.session.customer[0].id,

            login: req.session.customer[0].login,
            userName: req.session.customer[0].userName,
            face: req.session.customer[0].face,
        }])

        /*   const postItem: Post = Post.build({
               id: ++countAllItemsInTodoList,
               checked: req.body.done === 'true',
               text: req.body.text,
               customer_id: req.session.customer[0].id,

               login: req.session.customer[0].login,
               userName: req.session.customer[0].userName,
               face: req.session.customer[0].face,
           });
           await postItem.save();*/
        res.status(201).send(postItem[0]);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});

/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
apiV1Route.put('/', isCorrectToken, textValidMiddleware(), idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const postIsChanging = await Post.findByPk(+req.body.id);
        /*ckeking if curent user make changing
        console.log(postIsChanging.login === req.session.customer[0].login);*/

        if (postIsChanging) {
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
        const deleteTodoItem = await Post.findAll({
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


