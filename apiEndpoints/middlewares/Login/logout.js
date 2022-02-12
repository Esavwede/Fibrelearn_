

// models 
const Users = require('../../models/user')

const logout_post = async function(req, res, next)
{
    try{
        // find user with the refresh token 
        const user = await Users.findOne({ _id: req.params.id })

        user.refreshToken = ''

        await user.save()

        return res.status(204).json({"success": true, "msg":"logged out successfully "})
        }
        catch(err)
        {
            return res.status(500).json({ "success": false, "msg":"error occured during logout "})
        }
}