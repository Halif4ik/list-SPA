import {DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';

class Commit extends Model {
}

const model = Commit.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    customer_id: {type: DataTypes.TINYINT.UNSIGNED},
    text: {allowNull: false, type: DataTypes.STRING},
    parentUuid: {allowNull: false, type: DataTypes.STRING},
}, {sequelize, tableName: 'ComentsList'});

export default model;

/*Coment.postsModel = postsModel.hasMany(Coments);*/

/*postsModel.hasMany(commitModel, {foreignKey: 'uuid'});*/
