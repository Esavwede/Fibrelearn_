// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema


//(teaching style { visual teacher, audio-visual, audio }, student preferences { sex, location, age, price},


const AgePreferenceSchema = new Schema 
(
    {
        from:
        {
            type: Number
        },
        to:
        {
            type: Number 
        }
    }
)



const VerificationBodySchema = new Schema 
(
    {
        upload_complete:
        {
            type: Boolean, 
            required: true, 
            default: false
        },
        upload_complete_date:
        {
            type: Date
        },
        id_image_uploaded:
        {
            type: Boolean, 
            required: true, 
            default: false
        },
        id_image_url:
        {
            type: String, 
            required: true,
            default:' ' 
        },
        result_uploaded:
        {
            type: Boolean, 
            required: true, 
            default: false
        },
        result_image_url:
        {
            type: String, 
            required: true,
            default:' ' 
        },
        selfie_uploaded:
        {
            type: Boolean, 
            required: true, 
            default: false
        },
        selfie_url:
        {
            type: String, 
            required: true,
            default:' ' 
        }
    }
)


const ReviewsSchema = new Schema 
(
    {
        from:
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
            default: Date.now() 
        },
        sentiment:
        {
            type: [String]
        }
    }
)


const StudentPreferencesSchema = new Schema 
(
    {
        sex:
        {   
            type: String
        },
        age:
        {   
            type: AgePreferenceSchema 
        }
    }
)



//   TutorProfileSchema 
const TutorProfileSchema = new Schema 
(
    {
        _id: 
        {
            type: mongoose.Types.ObjectId,
            required: true 
        },
        tutor_profile_picture_url: 
        {
            type: String, 
            default: 'No profile Picture'
        },
        tutor_firstname:
        {
            type: String,
            required: true 
        },
        bio:
        {
            type: String
        },
        tutor_rating:
        {
            type: Number,
            default: 0 
        },
        course_ads_count:{ type: Number},
        reviews_count:{ type: Number}, 
        reviews:
        {
           type: [ReviewsSchema]
        },
        student_preferences:
        {
            type: StudentPreferencesSchema
        },
        verification:
        {
            type: VerificationBodySchema
        },
        isVerified:
        {
            type: Boolean, 
            default: false
        }, 
        isAvailable:
        {
            type: Boolean, 
            default: true 
        }
    }
)

/**
 * Booking response times 
 * Average response time 
 */


// pre functions

// Tutor Profile => Profile Pic || bio || courses || ratings || reviewsNumber || 

// model 
const TutorProfiles  = mongoose.model('tutor_profiles',TutorProfileSchema)


//  export 
module.exports = TutorProfiles