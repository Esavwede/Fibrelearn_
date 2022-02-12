

// mongoose 
const mongoose = require('mongoose')

// schema 
const Schema =  mongoose.Schema


const CoursesSchema = new Schema
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


// Uniben Course Schema 
const UnibenFacultiesAndCoursesSchema = new Schema
(
    {
        facultyCode:
        {
            type: String,
            required: true
        },
        facultyName:
        {
            type: String,
            required: true
        },
        courses:
        {
            type:[CoursesSchema],
            required: true
        }
    }
)




// model
const UnibenFacultiesAndCourses = mongoose.model('Uniben_faculties_and_courses',UnibenFacultiesAndCoursesSchema)



module.exports = UnibenFacultiesAndCourses 