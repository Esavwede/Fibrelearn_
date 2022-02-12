


// Modules 
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

// import credentials
const { _CLIENT_ID, _CLIENT_SECRET, _REDIRECT_URI, _REFRESH_TOKEN } = require('../../constants/index')

// Credentials 
const CLIENT_ID = _CLIENT_ID
const CLIENT_SECRET = _CLIENT_SECRET
const REDIRECT_URI = _REDIRECT_URI
const REFRESH_TOKEN = _REFRESH_TOKEN 



// Authentification CLient 
const oAuth2Client = new google.auth.oAuth2( _CLIENT_ID, _CLIENT_SECRET, _REDIRECT_URI )
// setup credentials 
oAuth2Client.setCredentials({ refresh_token: _REFRESH_TOKEN })



//  Send Mail Function

async function send_Mail(mailBody)
{
    try
    {

        // get accesstoken 
        const accessToken = await oAuth2Client.getAccessToken()


        // Nodemailer transport 
        const transport = nodemailer.createTransport
        (
            {
                service:'gmail',
                auth:
                {
                    type:'oauth2',
                    user:'esavwede84@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN, 
                    accessToken: accessToken 
                }
            }
        )


        // send mail 
        const res = await transport.sendMail(mailBody)
        console.log("mail sent ")
        return res
    }
    catch(err)
    {
        console.log("mail not sent ")
        return err 
    }
}



//sendMail().then( res => console.log(res)).catch( err => console.log(err) )


export default send_Mail

