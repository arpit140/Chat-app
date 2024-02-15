const {DataTypes} = require("sequelize")
const sequelize = require('../Util/db')
const bcrypt = require('bcrypt')

const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password,10)
})

module.exports = User