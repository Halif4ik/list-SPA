import express, {NextFunction, Request, Response} from 'express';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/')
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}
const upload = multer({storage: storage, fileFilter: fileFilter});

router.post('/', upload.array('images', 5), async (req: Request, res: Response, next: NextFunction) => {
    console.log('!!!!req.body-', req.body);
    console.log('1111req.file-', req.file);
    console.log('files-', req.files);

    /*let newProduct = new ProductModel({
        name: req.body.name,
        price: req.body.price,
        images: req.files
    });
    await newProduct.save();*/
    res.send({error: 'forbidden)))'});
});
export {router as ProductRoutes};