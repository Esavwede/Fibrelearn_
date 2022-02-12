// mongoose 
const mongoose = require('mongoose')

// bcrypt 
const bcrypt = require('bcrypt')

// Schema 
const Schema = mongoose.Schema 
/*
user 
profile 
time

*/

const BookingOverviewSchema = new Schema 
(
    {
        booking_id:
        {
            type: mongoose.Types.ObjectId,
            required: true 
        },
        status:
        {
            type: String,
            required: true,
            default: 'inprogress'
        },
        course_code:
        {
            type: String,
            required: true 
        },
        sent_at:
        {
            type: Date,
            required: true
        },
        sent_by_me:
        {
            type: Boolean,
            required: true
        }, 
        seen_by_me:
        {
            type: Boolean,
            required: true, 
            default: false
        },
        seen_by_receiver:
        {
            type: Boolean,
            required: true,
            default: false 
        },
        tutor_id:
        {
            type: mongoose.Types.ObjectId,
            required: true 
        },
        tutor_profile_picture_url:
        {
            type: String
        },
        student_profile_picture_url:
        {
            type: String
        },
        tutor_firstname:
        {
            type: String
        },
        student_firstname:
        {
            type: String 
        },
        student_id:
        {
            type: mongoose.Types.ObjectId 
        }
    }
)

// UserSchema
const UserSchema  = new Schema
(
    {
        userIsNew:
        {
            type: Boolean,
            required: true, 
            default: true 
        }, 
        location: 
        {
            type: String
        },
        location_x_cord:
        {
            type: String
        },
        location_y_cord:
        {
            type: String
        },
        university:
        {
            type: String
        },
        department:
        {
            type: String
        },
        level:
        {
            type: Number 
        },
        email:
        {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        age:
        {
            type: Number
        },
        sex:
        {
            type: String
        },
        phone_number:
        {
            type: String
        },
        password:
        {
            type: String,
            required: true,
            unique: false,
            trim: false
        },
        firstname:
        {
            type: String,
            required: true, 
            trim: true 
        },
        lastname:
        {
            type: String,
            required: true,
            trim: true
        },
        profile_picture_url:
        {
            type: String,
            required: true,
            default: 'none'
        },
        profile_picture_id:
        {
            type: String,
            required: true,
            default: 'none'
        },
        isAdmin:
        {
            type: Boolean,
            required: true,
            default: false,
        },
        emailVerified:
        {
            type: Boolean,
            required: true,
            default: false
        },
        verificationCode:
        {
            type: String 
        },
        bookings_count:
        {
            type: Number,
            required: true,
            default: 0
        }, 
        lessons_count:
        {
            type: Number,
            required: true,
            default: 0 
        },
        notifications_count:
        {
            type: Number,
            required: true,
            default: 0
        },
        bookings:
        {
            type: [BookingOverviewSchema]
        }
    }
)


// Modeld
const Users = mongoose.model('users',UserSchema)


module.exports = Users 
// Hello I am a programmer , I love writing code that runs on all operating systems 