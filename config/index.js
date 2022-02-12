

const config = require('../.env') 


config()


export  const _DB_URI = process.env.DB_URI
export  const _CLIENT_SECRET  = process.env.CLIENT_SECRET
export  const _CLIENT_ID = process.env.CLIENT_ID
export  const _REDIRECT_URI = process.env.REDIRECT_URI
export  const _REFRESH_TOKEN = process.env.REFRESH_TOKEN 
export  const _PORT = process.env.PORT  
