

require('dotenv').config() 
const cloudinary = require('cloudinary').v2 
const  { CloudinaryStorage }= require('multer-storage-cloudinary')
const multer = require('multer')



// cloudinary setup 

cloudinary.config({ 
    cloud_name: 'fibrelearn', 
    api_key: '218556559236395', 
    api_secret: '1fJdAmfVZ5J49WhJNO5WXI12ENk'  
  });



const storage = new CloudinaryStorage
(
    {
        cloudinary: cloudinary,
        params:
        {
            folder: 'Dev'
        }
    }
)


const parser = multer({ storage})



const express = require('express')
const app = express() 


// Routes 


app.post('/image',async (req, res, next)=>{
        try 
        {

            console.log('in cloudinary upload ')
            console.log( req.file ) 
            cloudinary.uploader.upload(req.file.path, function(error, result) {console.log(result, error)});
            return res.status(200).json({"msg":"done"})
        }
        catch(err)
        {
            console.log("error occured while uploading image ")
            console.log(err) 
            return res.status(500).json({"msg":"error occured while uploading image "})
        }
})



async function start()
{
    try
    {
        app.listen(4000,()=>{ console.log(' Application listening on port 4000' )})
    }
    catch(err)
    {
        console.log(" error occured while starting application ")
        console.log(err) 
    }
}


start() 