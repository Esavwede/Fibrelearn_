


// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema 


// UserSchema
const TutorResultUploadSchema = new Schema
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true
        },
        document:
        {
            type: String
        }
    }
)


// pre functions 

// Model
const TutorResultUploads = mongoose.model('tutor_result_ploads',TutorResultUploadSchema)


module.exports = TutorResultUploads