


const createServerError = async function(msg,err,res)
{
    console.log(msg + " \n " + err )
    return res.status(500).json({ "success": false, msg })
}


module.exports = { createServerError } 