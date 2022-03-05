require('dotenv').config() 

// Mail gun Mailing 
const mailgun = require('mailgun-js') 
const DOMAIN = 'sandboxe5271d5756364137864df989eabb60b9.mailgun.org'
const mg = mailgun({ apiKey:'ed7fc8f21f5f9c6b1ae87a87875c2723-e2e3d8ec-c70e6db9', domain: DOMAIN})




// Email Body Template 
const { setMailBody } = require('./Email_Templates/verification_email')


// Mail Sending Function 

async function sendEmail(mailBody)
{
    try
    {
        mg.messages().send(mailBody, function (error, body) {
            console.log(body);
        });

    }
    catch(err)
    {
        return err 
    }
}


module.exports = { sendEmail }