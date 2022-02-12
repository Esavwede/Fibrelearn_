// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema 


// UserSchema
const NotificationItemSchema  = new Schema
(
    {
       subject:
       {
           type: String,
           required: true,
           default:'title'
       },
       body:
       {
           type: String,
           required: true
       },
       timeStamp:
       {
           type: Date,
           required: true,
           default: Date.now 
       },
       read:
       {
           type: Boolean,
           required: true, 
           default: false
       }
       // Notification Action 
    }
)


// pre functions 

// Notifications Schema 
const NotificationSchema = new Schema
(
    {
        _id:
        {
          type: mongoose.Types.ObjectId,
          required: true
        },
        notifications: 
        {
            type: [NotificationItemSchema],
            required: true,
            default: [] 
        }
    }
)


// Model
const Notifications = mongoose.model('notifications',NotificationSchema)


module.exports = Notifications
