



const mongoose = require('mongoose')


const Schema = mongoose.Schema




// User profile Schema 
const UserProfileSchema = new Schema
(
    {
        "firstname":
        {
            type: String
        },
        "lastname":
        {
            type: String
        },
        "email":
        {
            type: String
        },
        "sex":
        {
            type: String,
        },
        "age":
        {
            type: Number
        },
        "phoneNumber":
        {
            type: Number
        },
        "university":
        {
            type: String
        },
        "faculty":
        {
            type: String
        },
        "department":
        {
            type: String
        },
        "level":
        {
            type: Number
        }

    }
)


const UserProfiles = mongoose.model('user_profiles',UserProfileSchema)


module.exports = UserProfiles