const chalk = require('chalk')
const Users = require('../../../models/User')

/* GET  Dashboard  */
const dashboard_get = async function(req, res, next)
{
    try
    {
        const user_id = req.user._id 
        const user = await Users.findById({ _id: user_id },{ "notifications_count": 1, "bookings_count": 1, "profile_picture_url": 1, "userIsNew": 1, "emailVerified":1})
        if( !user ) return res.status(400).json({"success": false, "msg":"user not found "})

      
        const data = { notification_count: user.notifications_count,
                        bookings_count: user.bookings_count, 
                    profile_picture_url: user.profile_picture_url,
                    emailVerified: user.emailVerified
                    }

        if( user.userIsNew )
        { 
            user.userIsNew = false 
            await user.save() 

            return res.status(200).json({success: true, user_data: data, userIsNew: true })
        }
    
            return res.status(200).json({success: true, user_data: data, userIsNew: false})
        
    }
    catch(err){
            console.log( chalk.red(`error occured while loading tutor dashboard ${ err }`))
            return res.status(500).json({ success: false, "msg":"error occured while loading user dashboard "})
    }
   
}



module.exports = { dashboard_get }