

/************** GET new access Token  */

const Users = require('../../../models/User')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')
require('dotenv').config() 

const getNewAccessToken = async function(req, res, next)
{
    

    try
    {
        // assume the refresh token comes from params 
         const refreshToken =  req.body.refreshToken

        // check if refresh token is null 
        if( !refreshToken ) return res.status(400).json({"success":false, "msg":" not a valid refresh token "})

        // if it exists in for a user 
        const usersWithToken = await Users.findOne({ refreshToken })

        if( !usersWithToken ) return res.status(403).json({"success": false, "msg":" you are not authorized "})

         // verify the refresh token 
         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,async (err, user)=>{
       if(err) return res.status(403).status({"success": false, "msg":" not  a valid refresh token "})

           // pass the return user to the request and set a new access token 
           const _user = { "_id": user._id }

          // new access token 
          const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

          return res.status(200).json({"success": true, "msg":" created new access token ", "accessToken": "Bearer " + accessToken })
            // 
         })

    }
    catch(err)
    {
         return res.status(500).json({"success": true, "msg":" error occured while getting new access token "})
    }
}


/*** Authenticate Token  */

function authenticateToken(req, res, next)
{


    console.log(' trying to authenticate token ')
    // get the authorization part of the header 
    const authHeader = req.headers['authorization']

    console.log( authHeader )
    // get the token 
    const token = authHeader && authHeader.split(' ')[1]

    // check if the token exists 
    if( !token ) return res.status(401).json({"success": false, "msg":"no authentification token "})

    // If a token exists, verify 

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=>{

        if( err)
        {
            console.log(err) 
            return res.status(403).json({ "success": false, "msg":"you no longer have access, log in to continue "})
        } 
        req.user = user
        return next() 
    })
}






module.exports = {  getNewAccessToken, authenticateToken }