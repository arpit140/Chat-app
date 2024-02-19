const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const dotenv = require('dotenv').config()
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const UserRoutes = require('./Routes/UserRoute')
const jwt = require('jsonwebtoken')
const sequelize = require('./Util/db')
const Message = require('./models/MessageModel')
const Group = require('./models/GroupModel')




const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const chatMessages = []



//MiddleWares
app.use(cors({
    origin: 'http://127.0.0.1:4000',
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")));

app.use((req,res,next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET,(err,decodedToken) => {
            if(err){
                res.clearCookie('jwt')
                next()
            }else{
                req.userId = decodedToken.userId
                next()
            }
        })
    }else{
        next()
    }
})



//Syncing sequelize

sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synced")
    })
    .catch((err) => {
        console.log("Error syncing database", err)
    })

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public','welcome','welcome.html'))
})


// Socket.io Connection
io.on('connection', async (socket) => {
    console.log('A user connected');

  
    try {
        const chatHistory = await Message.findAll();
        socket.emit('chat history', chatHistory);
    } catch (error) {
        console.error('Error retrieving chat history from the database', error);
    }

    
    socket.on('request chat history', async (groupId) => {
        try {
            console.log('Received request for chat history. Group ID:', groupId);
            const history = await Message.findAll({ where: { groupId } });
          
            io.to(socket.id).emit('chat history', history);
        } catch (error) {
            console.error('Error retrieving chat history from the database', error);
        }
    });


    socket.on('chat message', async (msg) => {
        try {
            console.log('Received chat message:', msg);
            
         
            if (msg.group && msg.group.id) {
                await Message.create({
                    user: msg.user,
                    message: msg.message,
                    groupId: msg.group.id, 
                });
            }

            io.emit('chat message', msg);
        } catch (error) {
            console.error('Error saving chat message to the database', error);
        }
    });

    
    socket.on('switch group', (group) => {
        console.log(`User ${socket.id} switched to group: ${group.name}`);

    });

  
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});






app.use('/user', UserRoutes )


server.listen(process.env.PORT,(err) => {
    if(err){
        console.log("Error starting server",err)
    
    }
    console.log("Server is running...")
})