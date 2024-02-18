const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn: "1h"})
}


const UserController = {
    signup: async (req,res) => {
        const {name, email, phone, password} = req.body

        try{
            const userExists = await User.findOne({
                where: {
                    email: email
                }
            })
            if (userExists){
                return res.status(400).json({error: "User already exists"})
            }
            await User.create({name, email , phone, password})
            
            res.status(200).json({message : "signedUp successfully!"})
            
        }catch(error){
            console.error("Error in signup", error)
            res.status(500).json({error: "Internal server Error"})
        }

    },

    login: async (req,res) => {
        const{email,password} = req.body

        try{
            const user = await User.findOne({
                where:{
                    email: email,
                }
            })
            if(!user){
                return res.status(404).json({error:'User not found'})
            }
            const isValidPassword = await bcrypt.compare(password,user.password)

            if(!isValidPassword){
                return res.status(401).json({error: "Invalid Password"})

            }

            const token = generateToken(user.id)
            // req.io.emit('userLoggedIn', { userId: user.id, name: user.name })
            
            res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })

            res.status(200).json({message: "Login successfull", user: {name: user.name}})
            
        }catch(err){
            console.error('Error in login' , err)
            res.status(500).json({ error: "Internal server error"})
        }
    },
    getCurrentUserInfo: async (req, res) => {
        try {
            const user = await User.findByPk(req.userId);
            if (user) {
                res.status(200).json({ user: { name: user.name } });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error fetching current user information', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}

module.exports = UserController