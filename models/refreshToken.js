

// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



//    __Schema 
const RefreshTokenSchema = new Schema 
(
    {
        refreshToken:
        {
            type: String,
            required: true
        }
    }
)



// pre functions



// model 
const RefreshTokens  = mongoose.model('modelName',RefreshTokenSchema)


//  export 
module.exports = RefreshTokens 