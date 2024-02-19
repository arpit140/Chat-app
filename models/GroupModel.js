const { DataTypes } = require("sequelize");
const sequelize = require('../Util/db');
const User = require('./UserModel')

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Group.belongsToMany(User, { through: 'UserGroup' }); 
User.belongsToMany(Group, { through: 'UserGroup' });

module.exports = Group;
