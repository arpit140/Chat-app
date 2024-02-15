const User = require('../models/UserModel')

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

    }
}

module.exports = UserController