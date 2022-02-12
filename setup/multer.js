

const multer = require('multer')
const path = require('path')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2 




// multer configuration 
const storage = new CloudinaryStorage(
    {
        cloudinary: cloudinary,
        params:
        {
            folder:"DEV"
        }
    }
)


module.exports =  multer
(
    {
        storage: storage, 
        fileFilter:( req, file, cb ) =>
        {
            console.log('heyo ' + req.file ) 
            console.log(file.originalname) 
            let ext = path.extname(file.originalname)
            if( ext !== '.jpg' || ext !== '.jpeg' || ext !== '.png' )
            {
                cb(null, false)
                return 
            }
            cb(null, true)
        }
    }
)