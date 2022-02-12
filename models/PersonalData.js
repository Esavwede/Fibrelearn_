


// mongoose 
const mongoose = require('mongoose')

// Schema 
const Schema = mongoose.Schema



// personal data Schema
const PersonalDataSchema = new Schema
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true
        },
        firstname:
        {
            type: String,
            required: true
        },
        lastname:
        {
            type: String,
            required: true
        },
        middlename:
        {
            type: String,
            required: true,
            default: ' '
        },
        university:
        {
            type: String,
            required: true,
            default: ' '
        },
        department:
        {
            type: String,
            required: true,
            default: ' '
        },
        level:
        {
            type: Number,
            required: true, 
            default: 0
        },
        phone:
        {
            type: Number,
            required: true,
            default: 0
        },
        location:
        {
            type: String,
            required: true,
            default: ' '
        }
    }
)


// model
const PersonalDatas = mongoose.model('personnal_datas',PersonalDataSchema)


// export PersonnalData
module.exports = PersonalDatas