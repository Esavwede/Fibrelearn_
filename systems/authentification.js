




const express = require('express')
const app = express() 
const jwt = require('jsonwebtoken') 
require('dotenv').config() 


app.use(express.json())

const tokens = [] 
// Authenticate Token 
async function AuthenticateToken(req, res, next)
{
    try
    {
        console.log(' authenticating token ')
        const   authHeader  = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        console.log(token)
        if( token == null ) return res.status(401) 

        jwt.verify(token,'secretKey',(err, user)=>{
            if( err){ console.log('error occured while verifying token '); console.log(err); return res.status(403).json({"msg":"err"})}
            req.user = user 
            return next() 
        })
    }
    catch(err)
    {
        console.log('error occured while authenticating Token ')
        console.log(err) 
       return  res.status(500)
    }
}



// Posts 
const posts = 
[
    {
        "username":"usera",
        "title":"user a post"
    },
    {
        "username":"userb",
        "title":"user b post"
    }
]





// Home Route 
app.get('/',(req, res, next)=>{

    try
    {
        res.send('seen')
    }
    catch(err)
    {
        console.log('error ')
        console.log(err)
    }

})




//Get  Posts 
app.get('/posts',AuthenticateToken,(req, res, next)=>{
    try
    {
        console.log( req.user + ' logged in to view posts ') 
        res.status(200).json({"msg":"success", posts })
    }
    catch(err)
    {
        console.log('error occured while fetching posts ')
        console.log(err) 
        res.status(500).json({"msg":"err"}) 
    }
})




// Login 
app.post('/login',async (req, res, next)=>{

    try
    {

        // Authenticate User 


        // Authentication Done 
        const email = req.body.email 
        const _id = 'ID_1' 
        const user = { email }

        await console.log( process.env.ACCESS_TOKEN_SECRET)
        const accessToken = await jwt.sign( user,'secretKey',{ expiresIn:'60s'})
        const refreshToken = await jwt.sign(user,'secretKey')

        tokens.push(refreshToken) 
        
        return res.json({ accessToken, refreshToken })
    }
    catch(err)
    {
        console.log('error occured during login')
        console.log(err)
        return res.status(500).json({"msg":"err on login"})

    }

})


// get new access token 
app.post('/token',(req, res, next)=>{
    try
    {
        const refreshToken = req.body.token 

        if( !refreshToken ) return res.status(401).json({"msg":"request Bad"})

        if( !tokens.includes(refreshToken)) return res.status(403).json({"msg":"refresh token no longer valid"})

        jwt.verify(refreshToken,'secretKey',(err, user)=>{
            if( err) return res.status(403).json({"msg":" forbidden "})

            const newAccessToken = jwt.sign(user,'secretKey',{ expiresIn: '15m'})

            return res.status(200).json({ newAccessToken })
        })
    }
    catch(err)
    {
        console.log('error occured while getting new access token ')
        console.log(err)
        return res.status(500).json({"msg":"error occured while fetchin new refresh token "})
    }
})

app.listen(5000,()=>{ console.log('app running and listening on port 5000 ')})