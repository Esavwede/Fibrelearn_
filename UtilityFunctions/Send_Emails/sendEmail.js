require('dotenv').config() 

// Modules 
const { google } = require('googleapis')
const nodemailer = require('nodemailer') 


// API DATA
const CLIENT_ID = process.env.EMAIL_CLIENT_ID
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET 
const REDIRECT_URI = process.env.EMAIL_REDIRECT_URI
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN_SECRET


// New OAuth2Client 

const OAuth2CLient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
OAuth2CLient.setCredentials({ refresh_token: REFRESH_TOKEN })


// Email Body Template 
const { setMailBody } = require('./Email_Templates/verification_email')


// Mail Sending Function 

async function sendEmail(mailBody)
{
    try
    {


        // generate access token 
        const accessToken = await OAuth2CLient.getAccessToken()

        // create a new transport for the email 
        const transport = await nodemailer.createTransport
        (
            {
                service:'gmail',
                auth:
                {
                    type:'OAuth2',
                    user:'fibrelearn@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken 
                },
                tls:
                {
                    rejectUnauthorized: false
                }
            }
        )


        const result = await transport.sendMail(mailBody)
        return result 

    }
    catch(err)
    {
        return err 
    }
}



module.exports = { sendEmail }