import {DataTypes} from 'sequelize'
import {sequelize} from '../utils/database';

export const CustomerModel = sequelize.define('customer_list',{
    id:{
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
        type:DataTypes.INTEGER
    },
    login:{
        allowNull:false,
        type:DataTypes.STRING
    },
    pass:{
        allowNull:false,
        type:DataTypes.STRING
    },
    csrf:{
        allowNull:false,
        type:DataTypes.STRING
    },
})