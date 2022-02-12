// online 
// title
// code 
// date 
// time 
// type 
// if not single max number of students 
// location
// price
// rating
// cgpa 
// positive reviews 



// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



//    __Schema 
const AllCourseSchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true 
        },
        online:
        {
            type: Boolean,
            required: true, 
            default: true
        },
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
        coursePrice:
        {
            type: Number,
            required: true
        },
        days:
        {
            type: [String],
            required: true 
        },
        courseDescription:
        {
            type: String,
            required: true
        },
        keyThingsToLearn:
        {
            type: [String],
            required: true
        },
        startHour:
        {
            type: Number,
            required: true
        },
        endHour:
        {
            type: Number,
            required: true 
        },
        startMin: 
        {
            type: Number,
            required: true 
        },
        endMin:
        {
            type: Number,
            required: true 
        },
        singleClass:
        {
            type: Boolean,
            default: true 
        },
        singleClass:
        {
            type: String,
            required: true, 
            default: 'student'
        },
        tutorRating:
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
        }

    }
)



// pre functions



// model 
const AllCourses  = mongoose.model('all_courses',AllCourseSchema)


//  export 
module.exports = AllCourses 