import {Request, Response, Router} from "express";
import {checkValidationInMiddleWare, idValid, textValidMiddleware} from "../midleware/validator";
import {isCorrectToken} from "../midleware/iscorectToken";
import {todoModel} from "../models/todoModel";

export const apiV1Route = Router({});
let ID = 1;

/*get All*/
apiV1Route.get('/', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) return res.send({error: 'forbidden'});
    try {
        const allTodos = await todoModel.findAll({
            where: {
                login: req.session.customer[0].login
            }
        });
        res.send({items: allTodos});
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});
/*create new task*/
apiV1Route.post('/',isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    try {
        const todoItem = todoModel.build({id: ID++, checked: req.body.done === 'true', text: req.body.text,login:req.session.customer[0].login });
        await todoItem.save();
        res.status(201).send(todoItem);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});

/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
apiV1Route.put('/', textValidMiddleware(), idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const changedTodoItem = await todoModel.findByPk(+req.body.id);
        changedTodoItem?.text = req.body.text;
        changedTodoItem?.checked = !!req.body.checked
        changedTodoItem?.save();
        res.status(201).send({'ok': true} as IResult);
    } catch (e) {
        console.log(e);
        res.sendStatus(400).send({'bad': false} as IResult)
    }


})
/* deleteTask */
apiV1Route.delete('/', idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const deleteTodoItem = await todoModel.findAll({
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


