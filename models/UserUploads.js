

// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



//    UserIdentitySchema 
const UserUploadSchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true
        },
        securityPicture:
        {
            type: String,
        },
        transcriptPicture:
        {
            type: String
        },
        timeStamp:
        {
            type: Date, 
            required: true,
            default: Date.now 
        }
    }
)



// pre functions


// model 
const  UserUploads = mongoose.model('user_identity_uploads',UserUploadSchema)


//  export 
module.exports = UserUploads 