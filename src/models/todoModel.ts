import {Sequelize,DataTypes} from 'sequelize'
import {sequelize} from '../utils/database';

export const todoModel = sequelize.define('TodoList',{
    id:{
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
        type:DataTypes.INTEGER
    },
    done:{
        allowNull:false,
        type:DataTypes.BOOLEAN
    },
    title:{
        allowNull:false,
        type:DataTypes.STRING
    },
    date:{
        allowNull:false,
        type:DataTypes.DATE
    },
})