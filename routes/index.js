var express = require('express');
var router = express.Router();

const User = require('../models/User')
const jwt = require('jsonwebtoken')

/**
 * @swagger 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: 
 *         - password
 *         - email 
 *       properties:
 *         _id:
 *           type: string 
 *           description: auto generated id on the backend 
 *         email:
 *           type: string,
 *           description: email submitted by user 
 *         password:
 *           type: string,
 *           description:  password submitted by user 
 *         isAdmin:
 *           type: boolean
 *           description: if the user is an admin or not 
 *         verificationCode:
 *           type: string,
 *           description: verification code attached to the users verification link
 *         refreshToken:
 *           type: string,
 *           description: refresh token assigned to user 
 *         refreshTokenAssignedOn:
 *           type: date
 *           description: date the refresh token was assigned to the user
 *       example:
 *         _id: dk3923fkjsgafa 
 *         password: &(@#w39slk)
 *         email: user@gmail.com
 *         isAdmin: false
 *         verificationCode: alefa3iea3wl
 *         refreshToken: aefei38232 
 *         refreshTokenAssignedOn: 2021-09-20T03:33:22.903Z
 */



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET Email Verification Page . */
router.get('/verifyEmail/:verificationCode', async function(req, res, next) {

  try
  {
      console.log(' in verify email ')
      const verificationCode = req.params.verificationCode 
      
    console.log('in here ')
      // find user assigned  the verification code 
      const user = await User.findOne({ verificationCode: req.params.verificationCode })



      // user does not exist ?
      if( !user)
      {
          return res.status(200).json({"success":false, "msg":" invalid verification code "})
      }

      // modify the user object 
      user.verified = true 
      user.verificationCode = undefined

      user.markModified('verified')
      user.markModified('verificationCode')

      await user.save()

      // return the tokens and user should be automatically redirected at the frontend 
      const userObj = { "_id": user._id }
      const accessToken = await jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET)
      const refreshToken = await  jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET)

      return res.status(200).json({"emailVerified": true ,accessToken: "Bearer "+ accessToken, refreshToken, user_id: user._id })
  }
  catch(err)
  {   
      console.log(err)
      return res.status(500).json({"success":false, "msg":"error occured while verifying email verification code  "})
  }

});


module.exports = router;
