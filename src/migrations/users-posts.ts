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

    await queryInterface.createTable('skills', {
        id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {type: DataTypes.STRING(255), allowNull: false}
    });

    await queryInterface.createTable('users_details', {
        user_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true,
            unique: true
        },
        position: {type: DataTypes.STRING(255), allowNull: false},
        salary: {type: DataTypes.STRING(255), allowNull: false},
        english_level: {type: DataTypes.STRING(255), allowNull: false},
    });
    await queryInterface.createTable('users_ref_skills', {
        user_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true
        },
        skill_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true
        },
        years: {type: DataTypes.INTEGER.UNSIGNED}
    });
    await queryInterface.createTable('projects_refs_skills', {
        project_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true
        },
        skill_id: {
            type: DataTypes.BIGINT(20).UNSIGNED,
            primaryKey: true
        },
        years: {type: DataTypes.INTEGER.UNSIGNED}
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
    await queryInterface.addConstraint('users_ref_skills', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'users_ref_skills_users',
        references: {table: 'customers', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('users_ref_skills', {
        fields: ['skill_id'],
        type: 'foreign key',
        name: 'users_ref_skills_skills',
        references: {table: 'skills', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('projects_refs_skills', {
        fields: ['project_id'],
        type: 'foreign key',
        name: 'projects_refs_skills_projects',
        references: {table: 'posts', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('projects_refs_skills', {
        fields: ['skill_id'],
        type: 'foreign key',
        name: 'projects_refs_skills_skills',
        references: {table: 'skills', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
}

export
async function down(queryInterface) {
    await queryInterface.dropTable('projects_refs_skills');
    await queryInterface.dropTable('users_ref_skills');
    await queryInterface.dropTable('users_details');
    await queryInterface.dropTable('skills');
    await queryInterface.dropTable('posts');
    await queryInterface.dropTable('customers');
}
