import {DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';
import Customer from "./customer";
import Post from "./post";

class Commit extends Model {
}
const model = Commit.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    customer_id: {type: DataTypes.TINYINT.UNSIGNED},
    post_id: {type: DataTypes.SMALLINT.UNSIGNED},
    text: {allowNull: false, type: DataTypes.STRING},
}, {sequelize, tableName: 'ComentsList'});

/*model.belongsTo(Post, { foreignKey: 'post_id' });*/
/*model.belongsTo(Customer, { foreignKey: 'customer_id' });*/
export default model;
