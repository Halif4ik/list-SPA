import {Request} from 'express'
/*const upload = multer({ dest: 'public/' });*/
import multer, {FileFilterCallback} from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
        cb(null, 'public');
    },

    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
        const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1E7) + file.originalname;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})
/*const allowTypes: string[] = ['image/png', 'image/jpg', 'image/gif', 'text/plain']; allowTypes.includes(file.mimetype)*/

const fileFilter = (
    request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true)
    } else {
        console.log('mimetype-', file.mimetype);
        callback(null, false)
    }
}

export const upload = multer({storage: storage, fileFilter: fileFilter});