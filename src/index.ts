import app from './app';
import {db} from './models/index'
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.NODE_LOCAL_PORT || 3001;


db.sequelize.sync({force: true}).then(() => {
  app.listen(port, () => {
    console.log(`**Server is running on port: ${port}`);
  });
});

