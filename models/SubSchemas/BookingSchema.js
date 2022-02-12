


// mongoose
const mongoose = require('mongoose')


// Schema
const Schema = mongoose.Schema


// BookingsSchema 
const BookingItemSchema = new Schema
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true
        },
        timeStamp:
        {
            type: Date,
            required: true,
            default: Date.now 
        },
        status:
        {
            type:  String,
            required: true,
            default: 'inprogress' // accepted, declined, ongoing, cancelled
        },
        tutorName:
        {
            type: String
        },
        studentName:
        {
            type: String
        },
        tutorId:
        {
            type: mongoose.Types.ObjectId
        },
        studentId:
        {
            type: mongoose.Types.ObjectId
        },
        seen:
        {
            type: Boolean,
            required: true,
            default: false
        },
        courseCode:
        {
            type: String,
            required: true 
        },
        courseName:
        {
            type: String,
            required: true
        },
        tutorProfilePicture:
        {
            type: String 
        },
        studentProfilePicture:
        {
            type: String
        },
        sentByme:
        {
            type: Boolean,
            required: true, 
            default: false
        },
        location:
        {
            type: String, 
            required: true, 
            default: 'To be decided when paid '
        },
        pricePerHour:
        {
            type: Number,
            required: true,
        }
    }
)

// getting detailed information about booking
// sentByMe: true  Bookings.findOne({ _id: req.user.id })
// sendByMe: false Bookings.findOne({ _id: tutorId })


// deleting
//  tutor: set deleted by tutor to true
// check if deleted by student is true
    // true: delete the doc
    // false: make it not accessible to the tutor

// student: set deleted by student to true
// same as tutor

// once both are deleted, delete the overall 

// // Booking Schema
// const BookingItemDetailedSchema = new Schema
// (
//     {
//         startDate:
//         {
//             type: Date,
//         },
//         endDate:
//         {
//             type: Date
//         },
//         days:
//         {
//             type: String,
//             required: true,
//             default:'tdb'
//         },
//         location:
//         {
//             type: String,
//             required: true,
//             default:'tdb'
//         },
//         price:
//         {
//             type: Number,
//             required: true,
//             default: 0
//         },
//         courseName:
//         {
//             type: String,
//             required: true,
//             default:'tdb'
//         },
//         courseCode:
//         {
//             type: String,
//             required: true,
//             default: 'tbd'
//         },
//         StudentComment:
//         {
//             type: String,
//             required: true,
//             default:'tdb'
//         },
//         tutorComment:
//         {
//             type: String,
//             required: true,
//             default:'tdb'
//         },
//         delined:
//         {
//             type: Boolean,
//             default: false,
//             required: true
//         },
//         accepted:
//         {
//             type: Boolean,
//             default: false,
//             required: true 
//         },
//         bookedAt:
//         {
//             type: Date,
//             required: true,
//             default: Date.now 
//         },
//         tutor:
//         {
//             type: mongoose.Types.ObjectId
//         },
//         student:
//         {
//             type: mongoose.Types.ObjectId
//         }
//     }
// )



module.exports = { BookingItemSchema } 