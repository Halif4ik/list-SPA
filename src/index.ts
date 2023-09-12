import exprApp from './app';
import {sequelize} from './utils/database';

const port = process.env.PORT || 3001;
sequelize.sync({force: false}).then(() => {
    exprApp.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
});
