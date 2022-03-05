const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const DaySchema = new Schema 
(
    {
        day:
        {
            type: String
        },
        time_of_day:
        {
            type: String
        }
    }
)



const BookingSchema = new Schema 
(
    {
        courseCode:{type: String, required: true},
        booked_on:{ type: Date, required: true, default: Date.now() },
        status:{ type: String, required: true, default: 'inprogress'},
        student_id:{ type: mongoose.Types.ObjectId, required: true},
        tutor_id:{ type: mongoose.Types.ObjectId, required: true },
        delete_count:{ type: Number, required: true, default: 0  },
        fixedPrice: { type: Boolean },
        totalLessonTime:{ type: Number }, 
        timePackageSelected:{ type: Number },
        timePackageCount:{ type: Number }, 
        commissionAmount:{type: Number },
        studentPays:{ type: Number },
        tutorReceives:{ type: Number }, 
        student_negotiation_price:{ type: Number },
        tutor_response_time:{ type: Date },
        negotiation_finish_time: {type: Date },
        negotiation_duration:{ type: Date},
        studentNote:{ type: String },
        studentDays:{ type: [DaySchema]},
        studentLocation:{ type: String },
        studentCancelReason:{ type: String },
        studentCancelNote: { type: String }, 
        tutorNote: {type: String },
        tutorDays: { type: [DaySchema] },
        tutorLocation:{ type: String },
        tutorDeclineReason:{ type: String },
        tutorDeclineNote:{ type: String },
        declined:{ type: Boolean },
        cancelled:{ type: Boolean },
        accepted:{ type: Boolean },
        renegotiationCount:{ type: Number, default: 0 }
    }
)/* Student renegotiated price and tutor acceptance */



const Booking = mongoose.model('bookings',BookingSchema)

module.exports = Booking 