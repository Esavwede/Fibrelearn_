

// mongoose
const mongoose = require('mongoose')

// Schema 
const Schema = mongoose.Schema 



// LessonHistoryItemSchema 
const LessonHistoryItemSchema = new Schema
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
        },
        tutor:
        {
            type: String
        },
        price:
        {
            type: Number
        },
        started:
        {
            type: Number
        },
        ended:
        {
            type: Number
        }
    }
)



// LessonHistory Schema 
const LessonHistorySchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId
        },
        history:
        {
            type:[LessonHistoryItemSchema]
        }
    }
)




// model
const LessonHistorys = mongoose.model('lessonHistorys',LessonHistorySchema)


module.exports = LessonHistorys