const User = require('../models/UserModel')
const bcrypt = require('bcrypt')

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

            res.status(200).json({message: "Login successfull"})
        }catch(err){
            console.error('Error in login' , err)
            res.status(500).json({ error: "Internal server error"})
        }
    }
}

module.exports = UserController