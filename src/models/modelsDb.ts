import {DataTypes, Model} from 'sequelize'
import {sequelize} from './indexDb';

export class Commit extends Model {
}

Commit.init(
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.SMALLINT.UNSIGNED,
        },
        CustomerId: {type: DataTypes.TINYINT.UNSIGNED},
        checkedCom: {type: DataTypes.BOOLEAN},
        children_comment_id: {allowNull: true, type: DataTypes.SMALLINT.UNSIGNED},
        post_id: {allowNull: false, type: DataTypes.SMALLINT.UNSIGNED},
        text: {allowNull: false, type: DataTypes.STRING(500)},
        attachedFile: { type: DataTypes.STRING},
    },
    {sequelize, tableName: 'ComentsList'}
);

export class Customer extends Model {
}
Customer.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.TINYINT.UNSIGNED
    },
    login: {allowNull: false, unique: true, type: DataTypes.STRING},
    pass: {allowNull: false, type: DataTypes.STRING},
    csrf: {allowNull: false, type: DataTypes.STRING},
    userName: {allowNull: false, type: DataTypes.STRING},
    homePage: {allowNull: true, type: DataTypes.STRING},
    face: {allowNull: true, type: DataTypes.INTEGER},

}, {
    timestamps: false,
    sequelize: sequelize,
    tableName: 'customer_list',
});
export class Post extends Model {
}

Post.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.SMALLINT.UNSIGNED
    },
    checked: {type: DataTypes.BOOLEAN},
    text: {allowNull: false, type: DataTypes.STRING(500)},
    editable: {allowNull: true, type: DataTypes.BOOLEAN},
    attachedFile: {allowNull: true, type: DataTypes.STRING},
    /*  creator: {*/
    CustomerId: {type: DataTypes.TINYINT.UNSIGNED},
    login: {allowNull: true, type: DataTypes.STRING},
    userName: {allowNull: false, type: DataTypes.STRING},
    face: {allowNull: true, type: DataTypes.INTEGER.UNSIGNED},

}, {sequelize, tableName: 'PostsList'});

Customer.hasMany(Commit);
Customer.hasMany(Post);


Post.hasMany(Commit, {as: 'Commits', foreignKey: 'post_id'});
Post.belongsTo(Customer, {as: 'Customers', foreignKey: 'CustomerId'});

Commit.belongsTo(Post, {as: 'Posts', foreignKey: 'post_id'});
Commit.belongsTo(Customer, {as: 'Customers', foreignKey: 'CustomerId'});
Commit.belongsTo(Commit, {foreignKey: 'children_comment_id', as: 'Parent'});
Commit.hasMany(Commit, {foreignKey: 'children_comment_id', as: 'Children'});
