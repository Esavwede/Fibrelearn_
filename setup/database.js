

// mongoose 
const mongoose = require('mongoose')
//mongoose.set('bufferCommands', false);
const chalk = require('chalk') 
// create connection

require('dotenv').config()

async function start_db()
{

    const DB_URI = process.env.DB_CONNECTION 

    const don = async function()
    {
        try
        {
            await mongoose.connect(DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 59000})    
        }catch(err)
        {
            console.log( DB_URI )
            return console.log('could not connect to the database ogaga ' + err)
        }
    }

    don() 
   
    // track connection
const db = mongoose.connection



// track db events 

db.once('open',()=>{
    // once database is opened 
    console.log( chalk.green('database connected'))
})


db.on('error',()=>{
    // once error occurs in database 
})

db.on('close',()=>{
    // once database connection is closed 
})

db.on('disconnected',()=>{
    // once database connection is disconnected 
})


}






// export db 
module.exports = { start_db }