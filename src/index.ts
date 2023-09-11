import exprApp from './app';
import {sequelize} from './utils/database';
/*import mongoose from 'mongoose';
mongoose.connect("mongodb://localhost:27017/multer", {useNewUrlParser: true})
    .then(() => console.log("Successfully connected to the following database"))
    .catch((err:Error) => {
        console.log(err);
    });*/

const port  = process.env.PORT || 3001;
sequelize.sync({force: false}).then(() => {
    const server = exprApp.listen(port, ()=> {
        console.log(`Server is running on port: ${port}`);
    });
});
