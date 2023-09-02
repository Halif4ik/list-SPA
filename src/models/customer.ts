import {DataTypes, Model} from 'sequelize'
import {sequelize} from '../utils/database';
/*
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

export const Customer: CustomerModelStatic = sequelize.define('customer_list', {
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
}) as CustomerModelStatic*/

class User extends Model {
}

const model = User.init ({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'users',
});

model.hasOne(UserDetails, { as: 'Details', foreignKey: 'user_id' });
model.hasMany(Project, { as: 'Projects', foreignKey: 'user_id' });