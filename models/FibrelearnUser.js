// mongoose
const mongoose = require('mongoose')


// Schema
const Schema = mongoose.Schema


// Schema Imports
const { BookingItemSchema, BookingItemDetailedSchema } = require('./SubSchemas/BookingSchema')
const { LessonSchema } = require('./SubSchemas/Lesson')


// UserSchema
const FibrelearnUserSchema  = new Schema
(
    {
        _id:  // good
        {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        notificationsCount:
        {
            type: Number,
            required: true,
            default: 0
        },
        bookingsCount:
        {
            type: Number,
            required: true,
            default: 0
        },
        personalData://  shared
        {
            type: mongoose.Types.ObjectId,
            ref: 'PersonalData'
        },
        notifications://  shared
        {
            type: mongoose.Types.ObjectId,
            ref: 'notifications'
        },
        transcriptUploaded:
        {
            type: Boolean,
            required: true,
            default: true
        },
        transcriptVerified:
        {
          type: Boolean,
          required: true,
          default: true
        },
        securityPictureUploaded:
        {
          type: Boolean,
          required: true,
          default: true
        },
        securityPictureVerified:
        {
            type: Boolean,
            required: true,
            default: true
        },
        isTutor:
        {
            type: Boolean,
            required: true,
            default: false 
        },
        bookingsOverview: // shared
        {
            type: [BookingItemSchema],
            required: true,
            default: []
        },
        tutor_uploads:
        {
            type: mongoose.Types.ObjectId,
            ref: 'tutorUploads'
        },
        tutoringHistory:
        {
            type: mongoose.Types.ObjectId,
            ref: 'tutoringHistory'
        },
        balance:
        {
            type: Number,
            required: true,
            default: 0
        },
        tutoringProfile:
        {
            type: mongoose.Types.ObjectId,
            ref: 'tutoringProfile'
        },
        myLessons:
        {
            type: [LessonSchema],
            required: true,
            default: []
        },
        verified:
        {
            type: Boolean,
            default: false
        },
        verificationUploads:
        {
            type: String,
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
const FibrelearnUser  = mongoose.model('fibre_learn_users',FibrelearnUserSchema)


module.exports = FibrelearnUser
