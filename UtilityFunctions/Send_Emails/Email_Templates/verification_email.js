


function setMailBody(userEmail)
{
    try
    {

        return  {
            from:'fibrelearn@gmail.com',
            to: userEmail,
            subject:' Fibrelearn Verification',
            text:' Click on the link to verify your fibrelearn account, click ',
            html: `<a href="http://localhost:3000/api/verifyEmail/${verificationCode}`
        }
    }
    catch(err)
    {
        return err
    }
}


module.exports = { setMailBody } 