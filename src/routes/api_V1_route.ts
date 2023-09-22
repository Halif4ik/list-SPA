import {checkValidationInMiddleWare, idValid, textValidMiddleware} from "../midleware/validator";
import {isCorrectToken} from "../midleware/iscorectToken";
import Customer from "../models/customer";
import Post from "../models/post";
import Commit from "../models/Commits";
import Tokens from "csrf";
import {Op} from "sequelize";
import express, {Express, NextFunction, Request, Response, Router} from 'express';
import * as fs from "fs";
import sharp from "sharp";

import {upload} from '../midleware/loadFile'
import multer from "multer";

const PAGE_PAGINATION = process.env.PAGE_PAGINATION ? parseInt(process.env.PAGE_PAGINATION) : 5;

const router: Router = express.Router();
const mimeTypeImg = ["image/jpg", "image/gif", "image/png"]

/* todo this midleware cheking dosent work in windows,*/
const uploadMidleware = (req: Request, res: Response, next: NextFunction) => {
    upload.single('images')(req, res, async function (err) {
            if (err instanceof multer.MulterError) res.status(400).json({error: 'More one file was uploaded'});
            else if (req.file && req.file.mimetype === "text/plain" && req.file.size > 1024) {
                fs.unlink(req.file?.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                    else console.log('File deleted successfully');
                });
                res.status(400).json({error: 'Too mach size uploaded .txt file'});
            } else next()
        }
    )
};

/*create new Post  todo isCorrectToken,*/
router.post('/', uploadMidleware, isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req, res) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    const attachedFile: Express.Multer.File | undefined = req.file;
    try {
        // Resize the image to PNG format (you can adjust the options)
        if (attachedFile && mimeTypeImg.includes(attachedFile.mimetype)) {
            const resizedImageBuffer: Buffer = await sharp(attachedFile.path)
                .resize({width: 320, height: 240})
                .toFormat(attachedFile.mimetype.slice(-3))
                .toBuffer();
            // Save the resized image to a new file
            fs.writeFile(attachedFile.path, resizedImageBuffer, async (writeErr) => {
                if (writeErr) {
                    console.error('Error writing resized image:', writeErr);
                    return res.sendStatus(500);
                }
            })
        }

        const postItem: Post[] = await Post.bulkCreate([{
            checked: req.body.done === 'true',
            text: req.body.text,
            customer_id: req.session.customer[0].id,
            attachedFile: attachedFile ? attachedFile.filename : '',
            login: req.session.customer[0].login,
            userName: req.session.customer[0].userName,
            face: req.session.customer[0].face,
        }]);
        res.status(201).send(postItem[0]);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});

/*create COMENT for Post todo move to POST*/
router.post('/commit', isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    try {
        const commitItem: Commit = await Commit.bulkCreate([{
            customer_id: req.session.customer[0].id,
            text: req.body.text,
            post_id: req.body.post_id
        }])

        res.status(201).send(commitItem);
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});
/*getAll*/
router.get('/', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) return res.send({error: 'forbidden'});
    const tokens: Tokens = new Tokens();
    let tokenSentToFront;
    const secret: string | undefined = req.session.secretForCustomer;
    if (secret) tokenSentToFront = await tokens.create(secret);

    try {
        const amountAll: number = await Post.count({
            where: {
                id: {
                    [Op.gt]: 0
                }
            }
        });
        const posts: Post [] = await gettingAllPosts(req.query?.page, req.query?.revert);

        res.send({
            items: posts,
            loginOfCurrentUser: req.session.customer[0].login,
            '_csrf': tokenSentToFront,
            amountPage: Math.ceil(amountAll / PAGE_PAGINATION) || 1
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});
/*getAll for only Current User*/
router.get('/my', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated) return res.send({error: 'forbidden'});
    let reqCurrentPage: string | any = req.query.page;
    if (isNaN(parseInt(reqCurrentPage))) reqCurrentPage = '1'

    const reqRevert: string | any = req.query.revert;
    const order = reqRevert === 'true' ? 'ASC' : 'DESC';

    try {
        const myPosts = await Post.findAll({
            where: {
                login: req.session.customer[0].login
            },
            include: [{
                association: 'Commits',
            }],
            order: [
                ['createdAt', order],
            ],
            limit: PAGE_PAGINATION,
            offset: PAGE_PAGINATION * (parseInt(reqCurrentPage) - 1),
        });

        /*kostil add user info to response array*/
        for (const onePost of myPosts) {
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

        res.send({items: myPosts});

    } catch (e) {
        console.log(e);
        res.sendStatus(404)
    }
});

/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
router.put('/', isCorrectToken, textValidMiddleware(), idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    try {
        const postIsChanging = await Post.findByPk(+req.body.id);

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
router.delete('/', isCorrectToken, idValid(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
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
    /* const rows: Costomer[] = await Customer.findAll({
            where: {
                id: req.session.customer[0].id,
            },
            include: [{
                association: 'Posts',
            }],
        });*/
})

interface IResult {
    [key: string]: boolean
}
export async function gettingAllPosts(needPage: string | any, revert: string | any): Post[] {
    if (!needPage || isNaN(parseInt(needPage)) || needPage === '0') needPage = '1'
    needPage = parseInt(needPage);
    const order = revert === 'true' ? 'ASC' : 'DESC';
    const posts: Post[] = await Post.findAll({
        where: {},
        include: [{
            association: 'Commits',
        }],
        order: [
            ['id', order],
        ],
        limit: PAGE_PAGINATION,
        offset: PAGE_PAGINATION * (parseInt(needPage) - 1),
    });
    /* console.log('--------', await posts[1].getCommits());
     console.log('********', await posts[1].getCustomer());*/
    /*kostil adding  user info in answer for all Commits*/
    for (const onePost: Post of posts) {
        const Commits: Post = onePost['Commits'];
        for (const currentCommit: Post of Commits) {
            const customerWichMakeCommit = currentCommit?.customer_id;
            const customerInfo: Customer[] = await Customer.findAll({
                where: {
                    id: customerWichMakeCommit,
                },
            })
            currentCommit.dataValues['customerInfo'] = {
                userName: customerInfo[0].dataValues.userName,
                face: customerInfo[0].dataValues.face,
                attachedFile: customerInfo[0].dataValues?.attachedFile || '',
            }
        }
    }
    return posts;
};
export {router as apiV1Route};
