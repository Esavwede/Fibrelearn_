
// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



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
        },
        tutor:
        {
            type: mongoose.Types.ObjectId,
        },
        student:
        {
            type: mongoose.Types.ObjectId
        }
    }
)



// CourseAd Summary Schema 

    // at the end of the day the user should have this in courseAds and fibrelearnuser.courseAd 
    // for the user to perform crud on the course, it will be done to the courseAds collection 
    // created > saved to course Ads 
    // read > read from courseAds, courses 
    // update > update from course ads
    // delete > delete from course ads 



module.exports = LessonSchema