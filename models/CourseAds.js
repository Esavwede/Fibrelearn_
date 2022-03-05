

const mongoose = require('mongoose') 
const Schema = mongoose.Schema 


const AvailableDaysSchema = new Schema 
(
    {
         day:
         {
             type: String, 
             required: true 
         },
         start_time_hour:
         {
            type: Number
         },
         start_time_minute:
         {
             type: Number 
         },
         end_time_hour:
         {
             type: Number 
         },
         end_time_minute:
         {
             type: Number 
         }
    }
)


const ReviewSchema = new Schema 
(
    {
        student_id: 
        {
            type: mongoose.Types.ObjectId,
            required: true 
        },
        text:
        {
            type: String,
            required: true 
        },
        date:
        {
            type: Date,
            required: true,
            default: Date.now() 
        },
        sentiment:
        {
            type: String,
            required: true,
            default: 'none'
        }
    }
)



const TimePackagesSchema = new Schema 
(
    {
        timeInMinutes: 
        {
            type: Number
        },
        price:
        {
            type: Number 
        },
        commissionAmount:
        {
            type: Number
        }
        
    }
)



const DaysAvailableSchema  = new Schema 
(
    {
        day:
        {
            type: String 
        },
        timeOfDay:
        {
            type: String 
        }
    }
)



const CourseAdSchema = new Schema 
(
    {
        tutor_id:
        {
            type: mongoose.Types.ObjectId,
            required: true 
        },
        tutor_profile_picture_url:
        {
            type: String
        },
        tutor_firstname:
        {
            type: String, 
            required: true 
        },
        courseName:
        {
            type: String
        },
        courseCode:
        {
            type: String
        },
        tutor_rating:
        {
            type: Number, 
            required: true
        },
        fixedPriceCommissionAmount:
        {
            type: Number
        },
        fixedPrice: 
        {
            type: Boolean, 
            required: true 
        },
        fixedPriceValue:
        {
            type: Number
        },
        timePackages:
        {
            type: [TimePackagesSchema]
        },
        daysAvailable:
        {
            type: [DaysAvailableSchema],
            default: [{"day":"anyday","time":"anytime"}] 
        },
        description:
        {
            type: String 
        },
        location:
        {
            type: String
        },
        reviews:
        {
            type: [ReviewSchema]
        },
        number_of_reviews:
        {
            type: Number 
        },
        active:
        {
            type: Boolean, 
            required: true, 
            default: true 
        },
        tutor_is_verified:
        {
            type: Boolean,
            required: true 
        },
        createdOn:
        {
            type: Date,
            default: Date.now(),
            required: true,
            immutable: true
        }
    }
)


/* Available Days and Price negotiable, preferred tutoring location  */ 

const CourseAds = mongoose.model('course_ads',CourseAdSchema)

module.exports = CourseAds 