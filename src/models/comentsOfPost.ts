import Sequelize, {BuildOptions, DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';

export interface IComentModel {
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
}) as CommitModelStatic

/*class Coment extends Model {}
Coment.init({
    uuid: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    text: {
        allowNull: false,
        type: DataTypes.STRING
    },
    login: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, { sequelize, modelName: 'Coment' });
Coment.postsModel = postsModel.hasMany(Coments);*/
/*postsModel.hasMany(commitModel, {foreignKey: 'uuid'});*/
