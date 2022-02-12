


// mongoose 
const mongoose = require('mongoose')
const PersonalData = require('./PersonalData')



// Schema 
const Schema = mongoose.Schema 

// Schema Imports
const { BookingItemSchema, BookingItemDetailedSchema } = require('./SubSchemas/BookingSchema')
const { LessonSchema } = require('./SubSchemas/Lesson')


// UserSchema
const StudentSchema  = new Schema
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        profilePicture:
        {
            type: String,
            required: true,
            default: 'Profile Picture'
        },
        personnalData:
        {
            type: mongoose.Types.ObjectId,
            ref: 'PersonalData'
        },
        notifications:
        {
            type: mongoose.Types.ObjectId,
            ref: 'notifications'
        },
        bookings:
        {
            type: [BookingItemSchema],
            required: true,
            default: []
        },
        myLessons:
        {
            type: [LessonSchema],
            required: true,
        }, 
        myLessonHistory:
        {
            type: mongoose.Types.ObjectId,
            ref: 'lessonHistory'
        }
    }
)


// pre functions 

// Model
const Students = mongoose.model('students',StudentSchema)

module.exports = Students
