

// MODELS 
const Users = require('../../../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config() 



const verifyEmailCode = async function(req, res, next)
{
    try
    {
   
        const verificationCode = req.params.verificationCode 

        // find user assigned  the verification code 
        const user = await Users.findOne({ verificationCode },{ _id: 1 })

        console.log( user )

        // user does not exist ?
        if( !user) return res.status(400).json({"success":false,"msg":" user with this verification code not found "})

        // modify the user object 
      
        user.verificationCode = null
        user.emailVerified = true
        user.markModified('emailVerified') 
        user.markModified('verificationCode')


        const result = await user.save()

        if( !result ) return res.status(500).json({"success": false, "msg":"error occured while updating email verification"})

        // return the tokens and user should be automatically redirected at the frontend
        const userObj = { "_id": user._id }
        const accessToken = await jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '2m'})
        const refreshToken = await  jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET)

        return res.status(200).json({ "success": true, "msg":" email verification code is verified redirect user to dashboard ", accessToken: "Bearer "+ accessToken, refreshToken })
    }
    catch(err)
    {   
        console.log(err)
        return res.status(500).json({"success":false, "msg":"error occured while verifying email verification code  "})
    }
}


module.exports = { verifyEmailCode } 