import multer from 'multer';
import {Express, NextFunction, Request, Response} from 'express';
import fs from "fs";
import path from "path";

const storage: multer.StorageEngine = multer.diskStorage({
    destination: function (req, file: Express.Multer.File, cb): void {
        cb(null, path.join(__dirname, '../../public/upload'))
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
export const upload = multer({storage: storage, fileFilter: fileFilter});



