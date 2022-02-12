

// mongoose 
const mongoose = require('mongoose')


// Schema 
const Schema = mongoose.Schema



// StudentSchema 
const StudentSchema  = new Schema
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId
        },
        datePaid:
        {
            type: Date,
        },
        amoutPaid:
        {
            type: Number
        },
        contractComplete:
        {
            type: Boolean,
        },
        paidToTutorAfterComplete:
        {
            type: Boolean
        }
    }
)

// paymentItem Schema 
const PaymentItemSchema = new Schema 
(
    {
        student_id:
        {
            type: mongoose.Types.ObjectId
        },
        course_id:
        {
            type: mongoose.Types.ObjectId
        },
        date_paid:
        {
            type: Date
        },
        amount_paid:
        {
            type: Number
        },
        contract_complete:
        {
            type: Boolean
        },
        tutor_paid:
        {
            type: Boolean
        }
    }
)



//   PaymentsSchema 
const PaymentSchema = new Schema 
(
    {
        _id:
        {
            type: mongoose.Types.ObjectId,
            required: true
        },
        walletId:
        {
            type: mongoose.Types.ObjectId
        },
        studentPayments:
        {
            type: [PaymentItemSchema]
        }
    }
)



// pre functions



// model 
const Payments  = mongoose.model('payments',PaymentSchema)


//  export 
module.exports = Payments 