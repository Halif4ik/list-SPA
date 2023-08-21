import express,{Request,Response} from 'express';
const exprApp = express()
const port = process.env.PORT || 3001
import path from'path';
import bodyParser from "body-parser";

exprApp.use(bodyParser({}));

exprApp.get('/', (req:Request, res:Response) => {
res.send('Hello!!!!')
    /*res.sendFile(path.join(__dirname, '../views','indexSpp.html'))*/
});


exprApp.listen(port, () => {
    console.log(`Example MYapp listening on port ${port}`)
})
