import {DataTypes, Model} from 'sequelize'
import Post from "./post";
import {sequelize} from "../utils/database";
import Commit from './Commits';

class Customer extends Model {
}
const model = Customer.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.TINYINT.UNSIGNED
    },
    login: {allowNull: false, unique: true, type: DataTypes.STRING},
    pass: {allowNull: false, type: DataTypes.STRING},
    csrf: {allowNull: false, type: DataTypes.STRING},
    userName: {allowNull: false, type: DataTypes.STRING},
    homePage: {allowNull: true, type: DataTypes.STRING},
    face: {allowNull: true, type: DataTypes.INTEGER},
}, {
    sequelize: sequelize,
    tableName: 'customer_list',
});
model.hasMany(Commit, {as: 'Commits', foreignKey: 'customer_id'});
model.hasMany(Post, {as: 'Posts', foreignKey: 'customer_id'});

export default model;

/*model.hasMany(Commits, {as: 'Commits', foreignKey: 'commit_id'});*/
/*model.hasMany(Project, {as: 'Projects', foreignKey: 'user_id'});*/
