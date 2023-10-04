import {checkValidationInMiddleWare, idValid, textValidMiddleware} from "../midleware/validator";
import {isCorrectToken} from "../midleware/iscorectToken";
/*import Customer from "../models/customer";
import Post from "../models/post";
import Commit from "../models/Commits";*/
import {Commit, Customer, Post} from '../models/modelsDb';
import Tokens from "csrf";
import {Op} from "sequelize";
import express, {Express, NextFunction, Request, Response, Router} from 'express';
import * as fs from "fs";
import sharp from "sharp";

import {upload} from '../midleware/loadFile'
import multer from "multer";

type FormatEnum = 'jpg' | 'png' | 'gif';
const PAGE_PAGINATION: number = process.env.PAGE_PAGINATION ? parseInt(process.env.PAGE_PAGINATION) : 5;

const router: Router = express.Router();
const mimeTypeImg = ["image/jpg", "image/gif", "image/png"]

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

/* Resize the image to PNG format (you can adjust the options)*/
async function reziseAndWriteIMG(attachedFile) {
    const extentionImg = attachedFile?.mimetype && attachedFile.mimetype.slice(-3) as FormatEnum ? attachedFile.mimetype.slice(-3) : 'png';
    if (attachedFile && mimeTypeImg.includes(attachedFile.mimetype)) {
        const resizedImageBuffer: Buffer = await sharp(attachedFile.path)
            .resize({width: 320, height: 240})
            .toFormat(extentionImg)
            .toBuffer();
        // Save the resized image to a new file
        fs.writeFile(attachedFile.path, resizedImageBuffer, async (writeErr: NodeJS.ErrnoException | null) => {
            if (writeErr) {
                throw new Error('writeErr');
            }
        })
    }
}

/*create new Post  todo isCorrectToken,*/
router.post('/', uploadMidleware, isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req, res) => {
    if (!req.session.isAuthenticated || !req.session.customer) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }

    try {
        const attachedFile: Express.Multer.File | undefined = req.file;
        await reziseAndWriteIMG(attachedFile);

        const postItem: Post[] = await Post.bulkCreate([{
            checked: req.body.done === 'true',
            text: req.body.text,
            CustomerId: req.session.customer[0].id,
            attachedFile: attachedFile ? attachedFile.filename : '',
            login: req.session.customer[0].login,
            userName: req.session.customer[0].userName,
            face: req.session.customer[0].face,
        }]);
        res.status(201).send(postItem[0]);
    } catch (e) {
        if (e === 'writeErr') {
            console.error('Error writing resized image: writeErr');
            return res.sendStatus(500);
        }
        console.log(e);
        res.sendStatus(404)
    }
});

/*create COMENT for Post todo move to POST*/
router.post('/commit', uploadMidleware, isCorrectToken, textValidMiddleware(), checkValidationInMiddleWare, async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated || !req.session.customer) {
        console.log('create new task Error');
        return res.send({error: 'forbidden'});
    }
    const attachedFile: Express.Multer.File | undefined = req.file;
    await reziseAndWriteIMG(attachedFile);

    console.log('create new task COMENT');
    console.log({
        CustomerId: req.session.customer[0].id,
        text: req.body.text,
        post_id: req.body.post_id,

        children_comment_id: req.body.children_comment_id,
        attachedFile:  attachedFile ? attachedFile.filename : '',
    })
    try {
        const commitItem: Commit = await Commit.bulkCreate([{
            CustomerId: req.session.customer[0].id,
            text: req.body.text,
            post_id: req.body.post_id,
            children_comment_id: req.body.children_comment_id,
            attachedFile:  attachedFile ? attachedFile.filename : '',
        }])
        res.status(201).send(commitItem);
    } catch (e) {
        if (e === 'writeErr') {
            console.error('Error writing resized image: writeErr');
            return res.sendStatus(500);
        }
        console.log(e);
        res.sendStatus(404)
    }
});
/*getAll*/
router.get('/', async (req: Request, res: Response) => {
    if (!req.session.isAuthenticated || !req.session.customer) return res.send({error: 'forbidden'});
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
        /* console.log(JSON.stringify(SSS, null, 2));*/
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
    if (!req.session.isAuthenticated || !req.session.customer) return res.send({error: 'forbidden'});
    try {
        const myPosts: Post [] = await gettingAllPosts(req.query?.page, req.query?.revert, {login: req.session.customer[0].login});
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
})

interface IResult {
    [key: string]: boolean
}

async function observerBdChanges(callback: (needPage: string | any, revert: string | any) => Post[],
                                 needPage: string | any, revert: string | any) {
    return new Promise(async (resolve, reject) => {
        const startAmountPosts = await Post.count({
            where: {
                id: {
                    [Op.gt]: 0
                }
            }
        });
        const startAmountCommits = await Commit.count({
            where: {
                id: {
                    [Op.gt]: 0
                }
            }
        });
        const interval: NodeJS.Timeout = setInterval(async () => {
            const newAmountAll = await Post.count({
                where: {
                    id: {
                        [Op.gt]: 0
                    }
                }
            });
            if (startAmountPosts != newAmountAll || startAmountCommits != await Commit.count({
                where: {
                    id: {
                        [Op.gt]: 0
                    }
                }
            })) {
                clearInterval(interval);
                resolve(callback(needPage, revert));
            }
        }, 2000);
    });
}

export async function awtingChangesAndGetAllPosts(needPage: string | any, revert: string | any): Promise<Post[]> {
    const resolvedResult: Post[] = await observerBdChanges(gettingAllPosts, needPage, revert);
    return resolvedResult;
}

async function gettingAllPosts(needPage: string | any, revert: string | any, whereParams = null) {
    if (!needPage || isNaN(parseInt(needPage)) || needPage === '0') needPage = '1'
    needPage = parseInt(needPage);
    const order = revert === 'true' ? 'ASC' : 'DESC';
    const posts: Post[] = await Post.findAll({
        where: whereParams ? whereParams : {},
        include: {
            association: 'Commits',
            include: [
                {
                    model: Commit,
                    as: 'Children',
                    attributes: ['id', 'CustomerId', 'text', 'createdAt', 'attachedFile', 'checkedCom']
                },
                {
                    model: Commit,
                    as: 'Parent',
                    attributes: ['id', 'post_id', 'text']
                }
            ]
        },
        order: [
            ['id', order],
        ],
        limit: PAGE_PAGINATION,
        offset: PAGE_PAGINATION * (parseInt(needPage) - 1),
    });


    /*kostil adding  user info in answer for all Commits*/
    for (const onePost: Post of posts) {
        const Commits: Post = onePost['Commits'];
        for (const currentCommit: Post of Commits) {
            const customerWichMakeCommit = currentCommit?.CustomerId;
            const customerInfo: Customer[] = await Customer.findAll({
                where: {
                    id: customerWichMakeCommit,
                },
            });
            currentCommit.dataValues['customerInfo'] = {
                userName: customerInfo[0].userName,
                face: customerInfo[0].face,
                attachedFile: customerInfo[0].attachedFile || '',
            }
        }
    }
    return posts;
};
export {router as apiV1Route};
