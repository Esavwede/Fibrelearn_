


// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



//    __Schema 
const HistoryItemSchema = new Schema 
(
    {
        title:
        {

        },
        student:
        {

        },
        completed:
        {

        },
        started:
        {

        },
        stopped:
        {

        },
        paid:
        {

        },
        amountPaid:
        {

        },
        reviews:
        {

        },
        rating:
        {

        }
    }
)



// HistorySchema 
const TutoringHistorySchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId
        },
        history:
        {
            type: [HistoryItemSchema]
        }
    }
)


// pre functions



// model 
const TutoringHistorys = mongoose.model('tutoring_historys',TutoringHistorySchema)


//  export 
module.exports = TutoringHistorys