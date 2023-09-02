import Sequelize, {BuildOptions, DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';
import {Post} from "./post";

/*export interface IComentModel {
    id: number;
    text: string;
    parentUuid: string;
}
export interface CommitsInstance extends Model<IComentModel>, IComentModel {
}
export type CommitModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): CommitsInstance;
};
export const commitModel: CommitModelStatic = sequelize.define('ComentsList', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    text: {
        allowNull: false,
        type: DataTypes.STRING
    },
    parentUuid: {
        allowNull: false,
        type: DataTypes.STRING
    },
}) as CommitModelStatic*/

class Commit extends Model {
}
const model = Commit.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    text: {
        allowNull: false,
        type: DataTypes.STRING
    },
    parentUuid: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, {sequelize, tableName: 'ComentsList'});

export default model;

/*Coment.postsModel = postsModel.hasMany(Coments);*/

/*postsModel.hasMany(commitModel, {foreignKey: 'uuid'});*/
