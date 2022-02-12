// mongoose 
const mongoose = require('mongoose')

// bcrypt 
const bcrypt = require('bcrypt')

// Schema 
const Schema = mongoose.Schema 


// MyLesson Schema 
const MyLessonSchema = new Schema
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId
        },
        progress:
        {
            type: Number
        },
        student_id:
        {
            type: mongoose.Types.ObjectId
        },
        tutor_id:
        {
            type: mongoose.Types.ObjectId
        },   
        teachingDays:
        {
            type // array of all the days in the teaching range and a mark for the days agreed 
        },
        courseCode:
        {
            type: String
        },
        price: 
        {
            type: Number
        },
        courseName:
        {   
            type: String
        },
        student_profile:
        {
            type: mongoose.Types.ObjectId
        },
        tutor_profile:
        {
            type: mongoose.Types.ObjectId
        },
        studentPhoneNumber:
        {
            type: Number
        },
        tutorPhoneNumber:
        {
            type: Number
        },
        startedOn:
        {
            type: Date
        },
        endedOn:
        {
            type: Date 
        }
    }
)


// Model
const MyLessons = mongoose.model('myLessons',MyLessonSchema)


module.exports = MyLessons


