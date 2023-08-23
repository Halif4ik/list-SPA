import express,{Request,Response} from 'express';
const exprApp = express()
const port = process.env.PORT || 3001
import path from'path';
import bodyParser from "body-parser";
import {apiV1Route} from "./routes/api_V1_route";

exprApp.use(express.static(path.join(__dirname, '../public')))
exprApp.use('/uploads',express.static(path.join(__dirname, '../uploads')))
/*exprApp.use(express.urlencoded({extended: true}))*/

exprApp.use(bodyParser({}));
exprApp.use('/api/v1', apiV1Route);

exprApp.use((req:Request, res:Response)=>{
    res.sendFile('/index.html');
});


exprApp.listen(port, () => {
    console.log(`Example MYapp listening on port ${port}`)
})
