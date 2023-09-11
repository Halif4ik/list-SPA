"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiV1Route = void 0;
const validator_1 = require("../midleware/validator");
const iscorectToken_1 = require("../midleware/iscorectToken");
const Commits_1 = __importDefault(require("../models/Commits"));
const customer_1 = __importDefault(require("../models/customer"));
const post_1 = __importDefault(require("../models/post"));
const csrf_1 = __importDefault(require("csrf"));
const sequelize_1 = require("sequelize");
const { PAGE_PAGINATION } = require('../constants');
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.apiV1Route = router;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter });
/*create new Post*/
router.post('/', upload.array('images', 5), async (req, res) => {
    console.log('!!!!req.body-', req.body);
    console.log('1111req.file-', req.file);
    console.log('files-', req.files);
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({ error: 'forbidden' });
    }
    try {
        const postItem = await post_1.default.bulkCreate([{
                checked: req.body.done === 'true',
                text: req.body.text,
                customer_id: req.session.customer[0].id,
                login: req.session.customer[0].login,
                userName: req.session.customer[0].userName,
                face: req.session.customer[0].face,
            }]);
        /*  const customerWithNewFilds = {
              firstName: req.body.name.trim() || registeredCustomer.firstName,
              img: req.file && req.file.path || registeredCustomer.img
          }*/
        res.status(201).send(postItem[0]);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});
/*create COMENT for Post*/
router.post('/commit', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), validator_1.checkValidationInMiddleWare, async (req, res) => {
    if (!req.session.isAuthenticated) {
        console.log('create new task Error');
        return res.send({ error: 'forbidden' });
    }
    try {
        const commitItem = await Commits_1.default.bulkCreate([{
                customer_id: req.session.customer[0].id,
                text: req.body.text,
                post_id: req.body.post_id
            }]);
        const rows = await customer_1.default.findAll({
            where: {
                id: req.session.customer[0].id,
            },
            include: [{
                    association: 'Posts',
                }],
        });
        res.status(201).send(commitItem);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});
/*getAll*/
router.get('/', async (req, res) => {
    if (!req.session.isAuthenticated)
        return res.send({ error: 'forbidden' });
    const tokens = new csrf_1.default();
    let tokenSentToFront;
    const secret = req.session.secretForCustomer;
    if (secret)
        tokenSentToFront = await tokens.create(secret);
    let reqCurrentPage = req.query.page;
    if (isNaN(parseInt(reqCurrentPage)))
        reqCurrentPage = '1';
    const revert = req.query.revert;
    const order = revert === 'true' ? 'ASC' : 'DESC';
    try {
        /*calculating all*/
        const amountAll = await post_1.default.count({
            where: {
                id: {
                    [sequelize_1.Op.gt]: 0
                }
            }
        });
        const posts = await post_1.default.findAll({
            where: {},
            include: [{
                    association: 'Commits',
                }],
            order: [
                ['id', order],
            ],
            limit: PAGE_PAGINATION,
            offset: PAGE_PAGINATION * (parseInt(reqCurrentPage) - 1),
        });
        /*kostil add user info in answer*/
        for (const onePost of posts) {
            const Commits = onePost['Commits'];
            for (const currentCommit of Commits) {
                const customerWichMakeCommit = currentCommit?.customer_id;
                const customerInfo = await customer_1.default.findAll({
                    where: {
                        id: customerWichMakeCommit,
                    },
                });
                currentCommit.dataValues['customerInfo'] = {
                    userName: customerInfo[0].dataValues.userName,
                    face: customerInfo[0].dataValues.face,
                };
            }
        }
        res.send({
            items: posts,
            loginOfCurrentUser: req.session.customer[0].login,
            '_csrf': tokenSentToFront,
            amountPage: Math.ceil(amountAll / PAGE_PAGINATION)
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});
/*getAll for only Current User*/
router.get('/my', async (req, res) => {
    if (!req.session.isAuthenticated)
        return res.send({ error: 'forbidden' });
    let reqCurrentPage = req.query.page;
    if (isNaN(parseInt(reqCurrentPage)))
        reqCurrentPage = '1';
    const reqRevert = req.query.revert;
    const order = reqRevert === 'true' ? 'ASC' : 'DESC';
    try {
        const myPosts = await post_1.default.findAll({
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
                const customerInfo = await customer_1.default.findAll({
                    where: {
                        id: customerWichMakeCommit,
                    },
                });
                currentCommit.dataValues['customerInfo'] = {
                    userName: customerInfo[0].dataValues.userName,
                    face: customerInfo[0].dataValues.face,
                };
            }
        }
        res.send({ items: myPosts });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});
/*markAsDone and update task 'v1' ? 'PUT'   {"text":"Djon!!!","id":1,"checked":true} */
router.put('/', iscorectToken_1.isCorrectToken, (0, validator_1.textValidMiddleware)(), (0, validator_1.idValid)(), validator_1.checkValidationInMiddleWare, async (req, res) => {
    try {
        const postIsChanging = await post_1.default.findByPk(+req.body.id);
        if (postIsChanging) {
            postIsChanging.text = req.body.text;
            postIsChanging.checked = !!req.body.checked;
            postIsChanging.save();
            res.status(201).send({ 'ok': true });
        }
        else {
            res.send({ 'bad': false });
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(409);
    }
});
/* deleteTask */
router.delete('/', (0, validator_1.idValid)(), validator_1.checkValidationInMiddleWare, async (req, res) => {
    try {
        const deleteTodoItem = await post_1.default.findAll({
            where: {
                id: +req.body.id
            }
        });
        deleteTodoItem[0]?.destroy();
        res.status(200).send({ 'ok': true });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400).send({ 'bad': false });
    }
    /*let curCustomer: Customer | null = await Customer.findOne({
            where: {
                id: {
                    [Op.eq]: req.session.customer[0].id
                }
            }
        });
       console.log('********', await curCustomer.getCommits());*/
});
//# sourceMappingURL=api_V1_route.js.map