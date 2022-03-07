const chalk = require('chalk')
const { randomBytes } = require('crypto')
const bcrypt = require('bcrypt') 
const {  createServerError } = require('../../../UtilityFunctions/ServerError/server_error') 



function setMailBody(from, to, subject, text, html)
{
        return {
                from,
                to,
                subject,
                text,
                html
        }
}

// Models 
const User = require('../../../models/User')

// Email Sending 
const { sendEmail} = require('../../../UtilityFunctions/Send_Emails/sendEmail')

require('dotenv').config() 

const domain = process.env.DOMAIN 



/* POST signup */
const signup_post = async function(req, res, next)
{
        try
        {
            // Get Req.body 
            /**
             * @example 
             * { email, password, firstname, lastname }
             */

            const {email, password, firstname, lastname } = req.body

            // validate data on backend 

            // Check if user exists 
            const userExists = await User.findOne({ email })

            if( userExists ) return res.status(400).json({"success": false, "msg":" email taken already "})

            // Create Email Verification Code 
            const verificationCode = randomBytes(20).toString("hex")
            const verificationRoute = `https://${req.headers.host}/api/verifyEmail/${verificationCode}`
            


                const encryptedPassword = await bcrypt.hashSync(password,10)
            // check error 
            
                // CREATE new user
                const userDoc = { email, password: encryptedPassword, firstname, verificationCode, lastname }
                const newUser = new User(userDoc)
                const savedUser = await newUser.save()

                 console.log(savedUser)

                 // set Mail Body 
                const mailBody =  setMailBody('fibrelearn@gmail.com',// from
                                email,// to 
                                'verify email',// subject 
                                ' visit the link to verify your fibrelearn account', // text 
                                ` click the link to verify your fibrelearn account - <a href="${verificationRoute}">click</a>`)// html 

                 // error occured while saving user ? 
                 if( !savedUser ) return res.status(500).json({"success":"false","msg":"error occured while saving new user "})

                 await sendEmail(mailBody).then((res)=> console.log(res)).catch((err)=> console.log('error occured while sending mail :' + err))
                 
                 // error occured while sending mail ? 

                
                // confirmation message
                console.log( chalk.green("tutor Signup successfull "))
                return res.status(201).json({"success": true, "msg":"signup successfull, check email for verification link "})
            
        }catch(err)
        {
           createServerError('error occured during signup ',err,res)
        }

        
}



module.exports = { signup_post }