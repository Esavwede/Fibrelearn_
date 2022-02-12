


// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema 

// personnal data Schema 
const PersonnalDataSchema = new Schema
(
    {
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
            required: true
        },
        university:
        {
            type: String,
            required: true
        },
        department:
        {
            type: String,
            required: true
        },
        level:
        {
            type: Number,
            required: true
        },
        phone:
        {
            type: Number,
            required: true
        },
        location:
        {
            type: String,
            required: true
        }
    }
)


// Booking Schema 
const BookingSchema = new Schema
(
    {
        startTime:
        {   
            type: String,
            required: true 
        },
        stopTime:
        {   
            type: String,
            required: true
        },
        days:
        {
            type: [], 
            required: true
        },
        location:
        {   
            type: String,
            required: true
        },
        price:
        {
            type: Number,
            required: true
        },
        lessonType:
        {
            type: String,
            required: true
        },
        course:
        {
            type: String,
        },
        StudentComment:
        {
            type: String,
        },
        tutorComment:
        {
            type: String
        }
    }
)



// Schedule Schema 
const ScheduleSchema = new Schema 
(
    {
        from:
        {
            type: String,
            required: true
        },
        to:
        {
            type: String,
            required: true,
        },
        location:
        {
            type: String,
            required: true
        },
        days:
        {
            type: String,
            required: true
        }
    }
)



// MyLessonSchema 
const LessonSchema  = new Schema
(
    {
        courseTitle:
        {
            type: String,
            required: true
        },
        courseCode:
        {
            type: String,
            required: true
        },
        schedule:
        {
            type: ScheduleSchema
        },
        percentageComplete:
        {
            type: Number,
            required: true
        },
        finished:
        {
            type: Boolean
        },
        paid:
        {
            type: Boolean
        }
    }
)


// ****************************** SETTINGS **********************************************************// 

const PersonnalInformationSchema = new Schema
(
    {
        firstname:{ type: String, required: true},
        lastname:{ type: String, required: true},
        middlename:{ type: String, required: true},
        university:{ type: String, required: true},
        department:{ type: String, required: true},
        level:{ type: Number, required: true},
        number:{ type: Number, required: true},
        email:{ type: String, required: true},
        location:{ type: String, required: true}   
    }
)




// Settings Schema 
const SettingsSchema = new Schema 
(
    {
        personnalInfo:
        {
            type: PersonnalInfomationSchema,
            required: true
        },
    }
)

// UserSchema
const UserBasedataSchema  = new Schema
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
            type: PersonnalDataSchema
        },
        notifications:
        {
            type: mongoose.Types.ObjectId,
            ref: 'notifications'
        },
        bookings:
        {
            type:[BookingSchema],
            required: true
        },
        myLessons:
        {
            type: [LessonSchema]
        },
        myLessonHistory:
        {
            type: mongoose.Types.ObjectId,
            ref: 'lessonHistory'
        },
        settings:
        {
            type: SettingsSchema,
            required: true
        }
    }
)


// pre functions 

// Model
const UserBasedata = mongoose.model('user',UserSchema)


module.exports = UserBasedata
