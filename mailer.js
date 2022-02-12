


// Steps in sending mail with google 

// Get modules 
// Get credentials 
// Create a new Authentificatin Client 
// Pass credentials to Client 
// Create a mail sending Function	
	// create a passport with the mail sending program, pass authentification details 
	// Create an email body 
	// pass the email body to the transport, send and wait for reply
	
	
	
// Modules 
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

// Credentials 
const CLIENT_ID = 
const CLIENT_SECRET = 
const REDIRECT_URI = 
const REFRESH_TOKEN = 



// Create New Authentification Client 
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
// set Credentails
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })



// Mail Sending Function
async function sendMail()
{
		try
		{
			// Get an access token 
			const accessToken = await oAuth2Client.getAccessToken()
			
			
			// Create a mail Transport 
			
			const transport = nodemailer.createTransport
			(
			{
				service:'gmail',
				auth:
				{
					client_id,
					client_secret,
					refresh_token
					accessToken,
				}
			}
			)
			
		}catch(err)
		{
			console.log(err)
		}
}

