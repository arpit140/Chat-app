const { DataTypes } = require("sequelize");
const sequelize = require('../Util/db');
const Group = require('./GroupModel');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

Message.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = Message;
