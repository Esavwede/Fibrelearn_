



async function start(_app)
{


// User model 
const User = require('../models/User')

    // login modules 
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash')
const session = require('express-session')
const { application } = require('express')


// initialize
_app.use(flash())
_app.use(session(
    {
        saveUninitialized: true,
        resave: false,
        secret:'mySecret'
    }
))


_app.use( passport.initialize())
_app.use( passport.session())


console.log('authentication initialization complete, waiting to execute local strategy')



///******************************OLD SESSION AUTHENTIFICATION ************************** */
// passport.use( new LocalStrategy({passReqToCallback: true, usernameField:'email'},async (req, username, password, authCheckDone)=>{
//     // get the user
//     const user = await User.findOne({ email: username })

//     if(!user )
//     {
//         return authCheckDone(null,false, req.flash('error','check email or password'))
//     }

//     if( user.password != password )
//     {
//         return authCheckDone(null, false, req.flash('error','check email or password'))
//     }

//     return authCheckDone(null,user)
// }))

// // serialize user
// passport.serializeUser((user, done)=>{
//     done(null,{ _id: user._id, type: user.type})
// })

// // deserialize user
// passport.deserializeUser((userData, done)=>{
//     done(null,userData)
// })


// NEW AUTHENTIFICATION WITH JWT 

passport.use('login', new LocalStrategy({ usernameField:'email', passwordField:'password' }, async ( email, password, done)=>{

    try
    {
        // get user from database 
        const user = await User.findOne({ email },{"email":1, "password":1, "_id": 1})
        console.log(user + ' in one ')

        // Check if the user does not exist 
        if( !user ) return done(null, false,{"message":" user not found "})

        const validate = await user.isValidPassword(password)

        if(!validate) return done(null, false,{"message":"password is incorrect "})

        // pass user to req
        req.user = user 
        
        return done(null, user,{"message":"User logged in successfully"})
    }
    catch(err)
    {
        return done(err)
    }
}))

}



module.exports = { start }