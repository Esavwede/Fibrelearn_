

// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



// ReviewSchema
const  ReviewSchema = new Schema
(
    {
        student:
        {
            type: mongoose.Types.ObjectId
        },
        comment:
        {
            type: String
        },
        date:
        {
            type: Date
        },
        sentiment:
        {
            type: String,
            required: true,
            default: 'neutral' // => positive, negativem, neutral
        }
    }
)



// Available Day Schema 
const AvailabilityDaySchema = new Schema
(
    {
        day:
        {
            type: String,
            required: true
        },
        startTime:
        {
            type: Number,
            required: true,
            default: 0
        },
        endTime:
        {
            type: Number,
            required: true,
            default: 0
        }
    }
)

// Course Schema 
const CourseSchema = new Schema
(
    {
       days:
       {
         type: [AvailabilityDaySchema],
         required: true,
         default: [{"day":"sun","startTime":0,"endTime":0},{"day":"mon","startTime":0,"endTime":0},{"day":"tue","startTime":0,"endTime":0},{"day":"wed","startTime":0,"endTime":0},{"day":"thur","startTime":0,"endTime":0},{"day":"fri","startTime":0,"endTime":0},{"day":"sat","startTime":0,"endTime":0}] // if empty user is available all day 
       },
       courseCode: 
       {
           type: String
       },
       courseName:
       {
           type: String
       },
       description:
       {
           type: String
       },
       pricePerHour:
       {
           type: Number
       },
       fixedPrice:
       {
           type: Number,
           default: 0
       },
       available:
       {
           type: Boolean,
           default: true
       },
       location:
       {
           type: String,
           required: true,
           default: 'studentLocation' // possible values => || studentLocation || tutorLocation || otherLocation
       }
    }
)


//    TutoringSchema 
const CourseAdSchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId
        },
        tutor_id:
        {
            type: String
        },
        tutorProfilePicture:
        {
            type: String
        },
        firstname:
        {
            type: String
        },
        tutorBio:
        {
            type: String,
            require: true,
            default: ''
        },
        rating:
        {
            type: Number,
            required: true,
            default: 0
        },
        numberOfReviews:
        {
            type: Number,
            required: true,
            default: 0
        },
        reviews:
        {
            type: [ReviewSchema]
        },
        courses:
        {
            type: [CourseSchema]
        },
        available:
        {
            type: Boolean,
            required: true,
            default: true
        },
        lessonsCompleted:
        {
            type: Number,
            required: true, 
            default: 0
        }

    }
)

// pre functions

// model 
const CourseAds = mongoose.model('course_ads',CourseAdSchema)


//  export 
module.exports = CourseAds


// On result 
    // all plus
        // Course Name
        // Price per hour for course 
        

        // persist both data with cookies to go to profile


        // On search, entire tutor profile is generated 
        // On specific tutor, rest results are hidden, specific tutor is zoomed 
        // 