import multer from 'multer';
import {Express, NextFunction, Request, Response} from 'express';
import fs from "fs";


const storage: multer.StorageEngine = multer.diskStorage({
    destination: function (req, file: Express.Multer.File, cb): void {
        cb(null, './public/upload')
    },
    filename: function (req: Request, file: Express.Multer.File, cb): void {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E7) + file.originalname)
    }
});
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/gif" || file.mimetype === "image/png" || file.mimetype === "text/plain") {
        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/GIF or png"), false);
    }
}
const upload = multer({storage: storage, fileFilter: fileFilter}).single('images');

export const uploadMidleware = (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async function (err) {
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