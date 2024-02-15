const express = require('express')
const dotenv = require('dotenv').config()
// const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors')
const UserRoutes = require('./Routes/UserRoute')
// const UserController = require('./Controllers/UserController')
const sequelize = require('./Util/db')

const app = express()

//MiddleWares
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")));


//Syncing sequelize

sequelize.sync()
    .then(() => {
        console.log("Database synced")
    })
    .catch((err) => {
        console.log("Error syncing database", err)
    })

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public','welcome','welcome.html'))
})

app.use('/', UserRoutes )



app.listen(process.env.PORT,(err) => {
    if(err){
        console.log("Error starting server",err)
    
    }
    console.log("Server is running...")
})