import Sequelize, {BuildOptions, DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';
import {postsModel} from "./postsModel";

export interface IcomentModel {
    id: number;
    text: string;
    login: string;
}

export interface ComentsInstance extends Model<IcomentModel>, IcomentModel {
}

export type ComentModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): ComentsInstance;
};
export const comentModel: ComentModelStatic = sequelize.define('ComentsList', {
    id: {
        autoIncrement: true,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    text: {
        allowNull: false,
        type: DataTypes.STRING
    },
    login: {
        allowNull: false,
        type: DataTypes.STRING
    },
}) as ComentModelStatic

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

postsModel.hasMany(comentModel, {foreignKey: 'uuid'});
