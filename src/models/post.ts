import { DataTypes, Model} from 'sequelize'
import {sequelize} from './indexDb';
import Commit from "./Commits";

class Post extends Model {
}
 Post.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    checked: {allowNull: false, type: DataTypes.BOOLEAN},
    text: {allowNull: false, type: DataTypes.STRING},
    editable: {allowNull: true, type: DataTypes.BOOLEAN},
    attachedFile: {allowNull: true, type: DataTypes.STRING},
    /*  creator: {*/
    customer_id: {type: DataTypes.TINYINT.UNSIGNED},
    login: {allowNull: true, type: DataTypes.STRING},
    userName: {allowNull: false, type: DataTypes.STRING},
    face: {allowNull: true, type: DataTypes.INTEGER.UNSIGNED},

}, {sequelize, tableName: 'PostsList'});

Post.hasMany(Commit, {as: 'Commits', foreignKey: 'post_id'});
/*model.belongsTo(Customer, {targetKey: 'id'});*/
/*model.belongsTo(Customer, { as: 'Customer',targetKey: 'id',foreignKey: 'customer_id' });*/
export default Post;





