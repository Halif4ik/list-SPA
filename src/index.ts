import exprApp from './app';
import {sequelize} from './utils/database';
const port = process.env.PORT || 3001;

/*
exprApp.listen(port, () => {
    console.log(`++++++++++++++++Server is running on port: ${port}`);
});

setTimeout(()=>{
    try {
        sequelize.authenticate().then(()=>{console.log('!!!!Connection has been established successfully.');})
    } catch (error) {
        console.error('!!!!Unable to connect to the database:', error);
    }


    sequelize.sync({force: false}).then(() => {
        console.error('*************');
    });},10000);
*/

sequelize.sync({force: false}).then(() => {
    exprApp.listen(port, () => {
        console.log(`**Server is running on port: ${port}`);
    });
});

