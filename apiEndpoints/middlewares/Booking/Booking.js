const  { createServerError }= require('../../../UtilityFunctions/ServerError/server_error')
const  Booking = require('../../../models/Booking')
const User = require('../../../models/User') 
const CourseAds = require('../../../models/CourseAds')
const TutorProfiles = require('../../../models/TutorProfile')


const createBooking_post = async function(req, res, next)
{
    try 
    {


            const student_profile_picture_url = req.user.profile_picture_url 
            const student_firstname = req.user.firstname
            const courseCode = req.body.courseCode 
            const student_id = req.user._id 
            const tutor_id = req.body.tutor_id 
            const tutor_firstname = req.body.tutor_firstname
            const tutor_profile_picture_url = req.body.tutor_profile_picture_url 
            const studentNote = req.body.studentNote    
            const studentDays = req.body.studentDays 
            const studentLocation = req.body.studentLocation 
            const fixedPrice = req.body.fixedPrice 
            const timePackage = req.body.timePackage
            const timePackageCount = req.body.timePackageCount 
            var sent_at
            var booking_id 

       

            if( fixedPrice )
            {
                // verify fixed price value 
                const priceResult = await CourseAds.findOne({ tutor_id, courseCode },{ _id: 0, fixedPriceValue: 1, fixedPriceCommissionAmount: 1})
                

                console.log(' here ogaga ' + priceResult ) 
               const commissionAmount = priceResult.fixedPriceCommissionAmount 
               const studentPays = priceResult.fixedPriceValue 
               const tutorReceives = studentPays - commissionAmount 


                                // creating booking 
                                delete req.body.tutor_firstname 
                                delete req.body.tutor_profile_picture_url 
                              
                                req.body.student_id = student_id 
                                req.body.studentPays = studentPays 
                                req.body.commissionAmount = commissionAmount 
                                req.body.tutorReceives = tutorReceives 
                    
                                
                                const doc = req.body 
                                const _newBooking = new Booking(doc)
                                const newBooking = await _newBooking.save() 
                               
                                console.log(newBooking) 
               
                           sent_at = newBooking.booked_on
                           booking_id = newBooking._id 
                               // created booking 


                
            }
            else 
            {
                // price Plans 
                 // verify fixed price value 
                 const priceResult = await CourseAds.findOne({ tutor_id, courseCode },{ _id: 0, timePackages: 1 })

                    console.log(' 1 here ogaga ' + priceResult) 
                 
                    let lessonPlans = priceResult.timePackages 
                    let count = timePackageCount 
                    let lessonPlansCount = lessonPlans.length 
                    let i = 0
                    var correctPlan 

                    for( i = 0; i < lessonPlansCount; i++ )
                    {
                            if(  lessonPlans[i].timeInMinutes === timePackage )
                            {
                                // time, price, commissionAmount 
                                correctPlan = { totalLessonTimeInMInutesPaidFor: ( timePackage * timePackageCount ), price: lessonPlans[i].price, commissionAmount: lessonPlans[i].commissionAmount }
                                break
                            }
                    }

                    if( correctPlan === null )
                    {
                        return res.status(400).json({"success": false, "msg":"wrong lesson plan "})
                    }

                    console.log('here ogaga  ' + correctPlan.totalLessonTimeInMInutesPaidFor ) 

                    const studentPays = ( correctPlan.price ) * ( timePackageCount )
                    const commissionAmount = ( correctPlan.commissionAmount ) * ( timePackageCount )
                    const tutorReceives = studentPays - commissionAmount
                    const totalLessonTime = correctPlan.totalLessonTimeInMInutesPaidFor


                                  // creating booking 
                                  delete req.body.tutor_firstname 
                                  delete req.body.tutor_profile_picture_url 
                                
                                  req.body.student_id = student_id
                                  req.body.studentPays = studentPays 
                                  req.body.commissionAmount = commissionAmount 
                                  req.body.tutorReceives = tutorReceives 
                                  req.body.totalLessonTime = totalLessonTime

                                  
                                  
                                  const doc = req.body
                                  const _newBooking = new Booking(doc)
                                  const newBooking = await _newBooking.save() 
                                 

                                  console.log('here ogaga the new booking  ' + newBooking ) 
                 
                              sent_at = newBooking.booked_on
                              booking_id = newBooking._id 
                                 // created booking 



            }
          
            
        

            const updateBody_student = {$push:{ bookings:[{ studentNote, studentDays, studentLocation, booking_id, courseCode, tutor_id, tutor_profile_picture_url,
                 seen_by_receiver: false, sent_by_me: true, tutor_firstname, sent_at, sent_by_me: true, seen_by_me: true }]}}

            const studentUpdate = await User.findByIdAndUpdate({ _id: student_id },updateBody_student)
            console.log(studentUpdate) 

            const updateBody_tutor = { $inc:{"bookings_count": 1}, $push: { bookings:[ {booking_id,courseCode, student_id, student_profile_picture_url, 
                seen_by_me: false, sent_by_me: false, student_firstname, sent_at,  sent_by_me: false } ] }}
            const tutorUpdate = await  User.findByIdAndUpdate({ _id: tutor_id },updateBody_tutor)
            console.log(tutorUpdate) //

                
            return res.status(201).json({"success": true, "msg":" new booking created successfully "})
    } catch (err) {
        console.log(err) 
        createServerError('error occured while creating booking',err,res)   
    }
}






const bookings_get = async function(req, res, next)
{
    try
    {
        const user_id = req.user._id 
        const bookings = await User.findById({ _id: user_id},{ _id: 0, bookings: 1 })
        console.log(bookings) 

        return res.status(200).json({"success": true, bookings })
    }
    catch(err)
    {
        createServerError('error occured while fetching bookings ',err,res)
    }
}





const booking_get = async function(req, res, next)
{
    try
    {
        const booking_id = req.params.booking_id 
        const updateBody  = 
        {
            _id: 0, studentDays:1, studentLocation: 1, studentNote: 1,  tutor_id: 1,
            tutorDays: 1, tutorNote: 1, tutorLocation: 1, studentCancelReason: 1, 
            studentCancelNote: 1, tutorDeclineNote: 1, tutorDeclineReason: 1, status: 1 
        }

    
        const booking = await Booking.findOne({ _id: booking_id },updateBody)
        console.log(booking) 

        return res.status(200).json({"success": true, booking })
    }
    catch(err)
    {
        createServerError('error occured while fetching booking ',err,res)
    }
}






const updateBookingsCount_patch =  async function(req, res, next)
{
    try
    {
        const user_id = req.user._id  
        const updateBody = { $set:{ "bookings_count": 0 }}
        const updateResult = await User.findByIdAndUpdate({ _id: user_id },updateBody)
      
        return res.status(200).json({"success": true, updateResult })
    }
    catch(err)
    {
        createServerError('error occured while fetching booking ',err,res)
    }
}




const updateBookingState_post = async function(req, res, next)
{
    try
    {
        const booking_id = req.body.booking_id 
        const user_id = req.user._id 
        const sender_id = req.body.sender 
        const coures_code = req.body.courseCode 
        

        const updateBody = { $set:{ "bookings.$[elem].seen_by_me": true }}
        const arrayFilter = { arrayFilters:[ { "elem.booking_id": booking_id }]}

        const updateResult = await User.findOneAndUpdate({ _id: user_id },updateBody,arrayFilter)

        const updateBody2 = { $set:{ "bookings.$[elem].seen_by_receiver": true }} 
        const arrayFilter2 = { arrayFilters: [ {"elem.booking_id": booking_id }]}

        await User.updateOne({_id: sender_id },updateBody2,arrayFilter2)

        return res.status(200).json({"success": true, updateResult })

    }
    catch(err)
    {
        createServerError('error occured while fetching booking ',err,res)
    }
}


const booking_patch = async function(req, res, next)
{
    try
    {
        
        const booking_id = req.body.booking_id 
        const sudentLocation = req.body.studentLocation
        const studentDays = req.body.studentDays 
        const studentNote = req.body.studentNote 
        


     
        const popUpdate = { $pop:{"days": -1 }}// old days array 
        const popUpdateResult = await Booking.findOneAndUpdate({ _id: booking_id },popUpdate)

        const pushUpdate = { $push:{ days }}//  new days array 
        const pushUpdateResult = await Booking.findOneAndUpdate({ _id: booking_id },pushUpdate)


        const updateBody = { $set:{ location } }
        
        const updatedBooking = await Booking.findByIdAndUpdate({ _id: booking_id },updateBody)
        console.log(updatedBooking)  

        return res.status(200).json({"success": true, updatedBooking})
    }
    catch(err)
    {
        createServerError('error occured while updating booking ',err,res)
    }
}



const renegotiateBooking_patch = async function(req, res, next)
{
    try
    {

        const studentUpdate = req.body.studentUpdate 
        const booking_id = req.body.booking_id 
        const receiver_id = req.body.second_person_id 

        if( studentUpdate === true )
        {
            
             const studentNote = req.body.studentNote
             const studentLocation = req.body.studentLocation
             const studentDays = req.body.studentDays 
     
             const updateBody = { $set:{ studentLocation, studentNote, studentDays } }
             
             const updatedBooking = await Booking.updateOne({ _id: booking_id },updateBody)


            // tutor update count for second party            
            const updateBody2 = { $inc:{ "bookings_count": 1}, $set: {"bookings.$[elem].seen_by_me": false }}
            const arrayFilter = { arrayFilters: [ { "elem.booking_id": booking_id }]}
            await User.updateOne({ _id: receiver_id },updateBody2, arrayFilter)
            


             console.log(updatedBooking)  
     
             return res.status(200).json({"success": true, updatedBooking, "msg":"student renegotiated booking"})
        }
        else 
        {
            const tutorNote = req.body.tutorNote
            const tutorLocation = req.body.tutorLocation
            const tutorDays = req.body.tutorDays 

    
            const updateBody = { $set:{ tutorLocation, tutorNote, tutorDays} }
            
            const updatedBooking = await Booking.updateOne({ _id: booking_id },updateBody)


             // tutor update count for second party            
             const updateBody2 = { $inc:{ "bookings_count": 1}, $set: {"bookings.$[elem].seen_by_me": false }}
             const arrayFilter = { arrayFilters: [ { "elem.booking_id": booking_id }]}
             await User.updateOne({ _id: receiver_id },updateBody2, arrayFilter)


            console.log(updatedBooking)  
    
            return res.status(200).json({"success": true, updatedBooking,'msg':"tutor renegotiated booking"})
        }

    }
    catch(err)
    {
        createServerError('error occured while renegotiating booking ',err,res)
    }
}





const booking_delete = async function(req, res, next)
{
    try
    {
        
         const booking_id = req.params.booking_id 
         const updateBody = { $pull:{ "bookings": { booking_id } }}
         const user_id = req.user._id 

         const deleteForUser  = await User.findByIdAndUpdate({ _id: user_id },updateBody)
        
         const booking_updateBody = { $inc: { "delete_count": 1 }}
         const booking_update_options = { new: true }
         const bookingUpdate = await Booking.findByIdAndUpdate({ _id: booking_id },booking_updateBody, booking_update_options)

         console.log(bookingUpdate) 
         if( bookingUpdate.delete_count > 1 )
        {
             await Booking.findByIdAndDelete({ _id: bookingUpdate._id })
        }

        return res.status(200).json({ "success": true, "msg":"successfully deleted booking "}) 
    }
    catch(err)
    {
        createServerError('error occured while deleting booking ',err,res)
    }
}


const declineBooking_patch = async function(req, res, next)
{
    try 
    {

        const user_id = req.user._id 
        const booking_id = req.body.booking_id 
        const student_id = req.body.student_id 

        const updateBody = { $pull:{ "bookings.booking_id": booking_id } }
        const options = { new: true } 

        await User.updateOne({ _id: user_id },updateBody,options)

        const updateBody2 = { $inc:{ delete_count: 1 }, $set:{"declined": true } }
        await Booking.updateOne({ booking_id },updateBody2)

        
        const updateBody3 = { $inc:{ "bookings_count": 1 }, $set:{ "status":"declined", "bookings.$[elem].seen_by_me": false }}
        const arrayFilter3 = { arrayFilters:[ {"elem.booking_id": booking_id }]}
        const userUpdate = await User.updateOne({ _id: student_id },updateBody3, arrayFilter3)


        return res.status(200).json({"success": true, "msg":" decline successfull "})


    }
    catch(err)
    {
        createServerError('error occured while declining booking for tutor ',err,res)
    }
}



const cancelBooking_patch = async function(req, res, next)
{
    try 
    {
        const booking_id = req.body.booking_id 
        const studentCancelNote = req.body.studentCancelNote 
        const studentCancelReason  = req.body.studentCancelReason 
        const tutor_id = req.body.tutor_id 

        // tutor has seen booking 
        const fields = { "seen_by_me": 1 }
        const result = await User.findOne({ _id: tutor_id, bookings:{ $elemMatch:{ booking_id }}},fields)

        if( result.seen_by_me === false )
        {
            // delete booking for tutor 
            const updateBody = { $inc:{ bookings_count: -1 }, $pull:{ "bookings": {booking_id } } }
            const tutorDelete = await User.updateOne({ _id: tutor_id },updateBody)
            // decrement the booking count 
            // increment delete count 

            const updateBody2 = { $inc:{ "delete_count": 1 }, $set:{ status: 'cancelled'}}
            const bookingUpdate = await Bookings.updateOne({ booking_id },updateBody2)

                   
        return res.status(200).json({"success": true, "msg":"booking cancelled"})
        }

            const BookingUpdateBody = { $set:{ studentCancelNote, studentCancelReason, "status": cancelleds }}
            const bookingUpdate = await Booking.updateOne({ booking_id },bookingUpdateBody)
        // update for tutor 
            const updateBody2 = { $inc:{ bookings_count: 1 }, $set:{ "bookings.$[elem].status": 'cancelled', "bookings.$[elem].seen_by_me": false} }
            const arrayFilter2 = { arrayFilters:[ { "elem.booking_id": booking_id }]}
            const tutorDelete = await User.updateOne({ _id: tutor_id },updateBody2,arrayFilter2)
        
        return res.status(200).json({"success": true, "msg":"booking cancelled"})
    }
    catch(err)
    {
        createServerError('error occured while canceling booking ',err,res) 
    }
}


module.exports = { createBooking_post, bookings_get, booking_get, booking_patch, booking_delete, updateBookingState_post, updateBookingsCount_patch,
renegotiateBooking_patch, declineBooking_patch, cancelBooking_patch}