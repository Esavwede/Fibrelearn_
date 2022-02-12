

// mongoose 
const mongoose = require('mongoose')

// Schema 
const { BookingItemDetailedSchema } = require('./SubSchemas/BookingSchema')
// Schema 
const Schema = mongoose.Schema



//    __Schema 
const BookingsSchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId, // student _id 
            required: true
        },
        bookings:
        {
            type:[BookingItemDetailedSchema], // tutor_id , course_id 
            required: true, // 
            default: []
        }
    }
)



// pre functions



// model 
const Bookings  = mongoose.model('bookings',BookingsSchema)


//  export 
module.exports = Bookings