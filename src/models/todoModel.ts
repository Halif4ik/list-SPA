import {BuildOptions, DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';

export interface ItodoModel {
    id: number;
    checked: boolean;
    text: string;
    editable: boolean;
    login: string;
    userName: string;
    face: number;
}

export interface TodoInstance extends Model<ItodoModel>, ItodoModel {
}

export type TodoModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): TodoInstance;
};
export const todoModel: TodoModelStatic = sequelize.define('TodoList', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER
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
        type: DataTypes.INTEGER
    },
}) as TodoModelStatic