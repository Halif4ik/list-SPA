import {BuildOptions, DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';
import {commitModel} from "./comentsOfPost";

export interface IPostModel {
    id: number;
    checked: boolean;
    text: string;
    editable: boolean;
    login: string;
    userName: string;
    face: number;
    uuid: string;
}

export interface PostInstance extends Model<IPostModel>, IPostModel {
}
export type PostsModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): PostInstance;
};
export const Post: PostsModelStatic = sequelize.define('PostsList', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    checked: {
        allowNull: false,
        type: DataTypes.BOOLEAN
    },
    text: {
        allowNull: false,
        type: DataTypes.STRING
    },
    editable: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    login: {
        allowNull: false,
        type: DataTypes.STRING
    },
    userName: {
        allowNull: false,
        type: DataTypes.STRING
    },
    face: {
        allowNull: true,
        type: DataTypes.INTEGER.UNSIGNED
    },
    uuid: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    },
}) as PostsModelStatic


/*commitModel.belongsTo(postsModel);*/
