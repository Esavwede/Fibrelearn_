// modules 
const jwt = require('jsonwebtoken')
const Users = require('../../../models/User')
const {  createServerError } = require('../../../UtilityFunctions/ServerError/server_error') 
const bcrypt = require('bcrypt')


require('dotenv').config() 


// Login Middleware 
async function loginValidator(req, res, next)
{
    try
    {
        // get req.body 
    var { email, password } = req.body

    console.log(' user validation started ')
    console.log(req.body) 

    // Find User with email
    const user = await Users.findOne({ email },{ "password":1, "email":1, "_id": 1, "firstname": 1, "profile_picture_url": 1, "isAdmin": 1 })

    console.log(user) 
    // incorrect email
    if(!user) return res.status(400).json({ "success": false, "msg": " user not found "})

    // incorrect password
    const passwordIsValid = await bcrypt.compareSync(password,user.password)


    console.log(passwordIsValid)
    if(!passwordIsValid) return res.status(400).json({"success": false, "msg":" password is invalid "})


    console.log('validating user done')
    

    console.log( user._id.toString() )
    
    
    // Pass User to request 
    req.user = { "_id": user._id.toString(), "isAdmin": user.isAdmin, "profile_picture_url": user.profile_picture_url, "firstname": user.firstname }

    // call the next middleware 
    return next() 
    }
    catch(err)
    {
        createServerError('error occured validating user ',err,res)
    }
    
}




/********POST Login ****************** */
const login_post = async function(req, res, next)
{


    try{
        const _user = req.user 

 
    const accessToken = await jwt.sign(_user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "3d"})
    const refreshToken = await  jwt.sign(_user, process.env.REFRESH_TOKEN_SECRET)
    
    const user_data = { accessToken: "Bearer "+ accessToken , refreshToken, personal_data: { user_id: req.user._id ,
                       isAdmin: req.user.isAdmin, profilePicture: req.user.profilePicture, firstname: req.user.firstname}}
    
    return res.status(200).json({"success":true, user_data})

    }catch(err){
        return res.status(500).json({"success": false, "msg":"error occured while logging in user "})
    }
    
}



module.exports = { login_post, loginValidator }
