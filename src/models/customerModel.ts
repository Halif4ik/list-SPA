import {DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';

export interface ICustomerModel {
    id: number;
    login: string;
    pass: string;
    csrf: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    userName: string;
    homePage?: string;
    face?: number;
}

export interface CustomerInstance extends Model<ICustomerModel, 'id' | 'login'> {
}
export interface CustomerModelStatic extends Required<ICustomerModel> {
}

export const CustomerModel: CustomerModelStatic = sequelize.define('customer_list', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.TINYINT.UNSIGNED
    },
    login: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
    },
    pass: {
        allowNull: false,
        type: DataTypes.STRING
    },
    csrf: {
        allowNull: false,
        type: DataTypes.STRING
    },
    userName: {
        allowNull: false,
        type: DataTypes.STRING
    },
    homePage: {
        allowNull: true,
        type: DataTypes.STRING
    },
    face: {
        allowNull: true,
        type: DataTypes.INTEGER
    },
}) as CustomerModelStatic