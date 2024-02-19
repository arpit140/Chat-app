const {Sequelize} = require('sequelize')
const dotenv = require('dotenv')

const sequelize = new Sequelize(process.env.DB_NAME  , process.env.DB_USER , process.env.DB_PASSWORD , {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (query) => {
        console.log(query)
    }
})

module.exports = sequelize