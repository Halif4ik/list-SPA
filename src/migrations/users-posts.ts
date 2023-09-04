export
async function up(queryInterface, {DataTypes}) {
    await queryInterface.createTable('customers', {
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
        face: {allowNull: true, type: DataTypes.INTEGER}
    });

    await queryInterface.createTable('posts', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            type: DataTypes.SMALLINT.UNSIGNED
        },
        checked: {allowNull: false, type: DataTypes.BOOLEAN},
        text: {allowNull: false, type: DataTypes.STRING},
        editable: {allowNull: true, type: DataTypes.BOOLEAN},
        login: {allowNull: false, type: DataTypes.STRING},
        userName: {allowNull: false, type: DataTypes.STRING},
        face: {allowNull: true, type: DataTypes.INTEGER.UNSIGNED},
        uuid: {allowNull: false, unique: true, type: DataTypes.STRING},
    });


    await queryInterface.addConstraint('posts', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'projects_ref_users',
        references: {table: 'customers', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('posts', {
        fields: ['login'],
        type: 'foreign key',
        name: 'projects_ref_users_2',
        references: {table: 'customers', field: 'id'},
        onDelete: 'set null',
        onUpdate: 'restrict'
    });
    await queryInterface.addConstraint('users_details', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'users_details_ref_users',
        references: {table: 'customers', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
}

export
async function down(queryInterface) {
    await queryInterface.dropTable('users_details');
    await queryInterface.dropTable('posts');
    await queryInterface.dropTable('customers');
}
