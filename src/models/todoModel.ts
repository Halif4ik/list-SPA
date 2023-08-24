import {DataTypes} from 'sequelize'
import {sequelize} from '../utils/database';

export const todoModel = sequelize.define('TodoList',{
    id:{
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
        type:DataTypes.INTEGER
    },
    checked:{
        allowNull:false,
        type:DataTypes.BOOLEAN
    },
    text:{
        allowNull:false,
        type:DataTypes.STRING
    },
    editable:{
        allowNull:true,
        type:DataTypes.BOOLEAN
    },
  /*  date:{
        allowNull:false,
        type:DataTypes.DATE
    },*/
})