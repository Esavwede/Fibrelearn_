const mongoose = require('mongoose')

const Schema = mongoose.Schema


const CourseSchema = new Schema 
(
    {
        courseCode:
        {
            type: String, 
            required: true 
        },
        courseName:
        {
            type: String,
            required: true 
        }
    }
)


const UnibenCoursesSchema = new Schema
(
    {
        faculty:
        {
           type: String, 
           required: true 
        },
        courses:
        {
            type:[CourseSchema]
        }
    }
)


const UnibenCourses = mongoose.model('uniben_courses',UnibenCoursesSchema) 


module.exports = UnibenCourses 