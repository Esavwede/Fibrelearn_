
// Models 
const Users = require('../../models/FibrelearnUser')// Fibrelearn User 
const AllCourses = require('../../models/AllCourses')// 
const Notifications = require('../../models/Notification')// User notifications 
const CourseAds = require('../../models/CourseAd')// Courses Uploaded by tutors 
const Bookings = require('../../models/Booking')// Booking Collection
const UnibenFacultiesAndCourses = require('../../models/UnibenFacultiesAndCourses')
const User = require('../../models/User') 
const UserProfile = require('../../models/UserProfile') 


const cloudinary = require('cloudinary') 
const chalk = require('chalk')// colourfull logging on the commandline 








/**********GET Notifications ***************************** */
const notifications_get = async function(req, res, next)
{
        try
        {

            console.log( chalk.blue('getting notifications '))
            const userId = req.params.userId 
            // return a list of notifications 
            const notifications = await Notifications.findById({ _id: userId })

            console.log( chalk.blue.inverse(` ${ notifications }`))
            return res.status(200).json({ success: true, "msg":" successfully fetched user notifications ", notifications })
            
        }catch(err)
        {
            console.log( chalk.red(`error occured while fetching notifications at tutor dashboard ${ err }`))
            return res.status(500).json({ success: false, "msg":"error occured while fetching notifications "})
        }

}



/* OPEN --- GET COURSE ADS */
 


// Get course Code
const getCourse_get = async function(req, res, next)
{
    try
    {
            

        // Get the request payload and use the returned data to search for a match
        var { facultyCode, courseCode } = req.params 
        console.log( chalk.blue( facultyCode + '  ' + courseCode ))
        

        // trim 
        facultyCode = facultyCode.trim()
        courseCode = courseCode.trim() 

        // search for entry in the database 
       const val = '^'+courseCode+'.*'
        const pipeline = 
        [
            { $match:{"facultyCode": facultyCode }},
            { $unwind: "$courses" },
            { $addFields:
                {
                    "courses.isAMatch":{ $regexFind:{ input:"$courses.courseCode", regex: val } }
                }
            },
            { $match: { "courses.isAMatch": { "$ne": null }}},
            { "$skip": parseInt(req.params.skip) },
            { "$limit": parseInt(req.params.limit) },
            { "$project": { "courses.courseName": 1, "courses.courseCode": 1, "_id": 0}}

        ]

        const result = await UnibenFacultiesAndCourses.aggregate(pipeline).allowDiskUse(true) 

        console.log(result) 

        // if no course matches 
            // cannot find any course that matches your search 
        return res.status(200).json({"success": true, "msg":" searched and retrieved courses successfully", matchedCourses: result })
    }
    catch(err)
    {
        console.log('error occured while fetching course code from database: \r\n' + err )
        res.status(500).json({"successfull": false, "msg":"could'nt fetch course from the database "})
    }
}







/** GET COURSE ADS ********************/

const searchForCourseLesson_get = async function(req, res, next)
{
    try
    {


        // BASIC SEARCH FOR TUTORS 

        // simple search without filters 
        const { courseCode, skip, limit } = req.params

  

        const pipeline = 
        [
            { $match:{ "available": true }},
            { $unwind: "$courses" },
            { $addFields:
                {"courses.isTheCourse":{ "$eq":["$courses.courseCode",courseCode]}}
            },
            { $match: { "courses.isTheCourse": { "$eq": true }, "courses.available": {"$eq": true }} },
            { "$limit": parseInt(limit)},
            { "$skip": parseInt(skip) },
            {"$project":{"courses.pricePerHour": 1, "courses.courseCode": 1, "tutorProfilePicture": 1, "firstname": 1, "rating": 1}}
        ]


        // result aggregation
        const lessonsList = await CourseAds.aggregate(pipeline)

        /*
        {
            _id,
            firstname,
            profilePic,
            pricePerHour,

            // action
                // Book 
                // persist tutorId, courseCode,...
        }
        */

        // return results 
        return res.status(200).json({ success: true, "msg":" successfully got course ads ", lessonsList  })
        
    }
    catch(err)
    {

        // Failed to Get Course Ads 
        console.log(err)
        return res.status(500).json({ success: false, "msg":" error occured while searching for tutors "})
    }
}




/* CLOSE  --- GET COURSE ADS */




/****TUTOR PROFILE *************************/




/********CLOSE TUTOR PROFILE ***************/




/** GET CREATE AD */
const createCourseAd_get = async function(req, res, next)
{


    /**
     * @ Notes 
     *  instead of comparing four variables, only verified should be retrieved and checked 
     */
    try
    {
        console.log( req.user._id )
        
        // Find User , get uploads status 
        const user = await Users.findById({ _id: req.user._id },{"securityPictureUploaded": 1, "securityPictureVerified": 1, "transcriptUploaded":1, "transcriptVerified": 1 })

        // User not existent 
        if(!user) return res.status(400).json({"success": false, "msg":" user does not exist "})

        // log result 
        console.log( chalk.blueBright(` ${ user }`))


        // Destructure user 
        const { securityPictureUploaded, securityPictureVerified, transcriptUploaded, transcriptVerified } = user


        // all uploads are verified 
        if( securityPictureUploaded && securityPictureVerified && transcriptUploaded && transcriptVerified )
        {
            return res.status(200).json({"success": true, "msg":" securityPicture and transcript Verified , user can create Course add ", canCreateCourseAd: true})
        }

        return res.status(200).json({"success":"true", "msg":" all details not verified, verify and try again",
    content:{ securityPictureUploaded, securityPictureVerified, transcriptUploaded, transcriptVerified, canCreateCourseAd: false }})

    }
    catch(err)
    {
        console.log( chalk.red(` Error occured while fetching create course Ad --- ${ err }`))
        return res.status(500).json({"success": false, "msg":"error occured while fetching tutors verified status for tutoring "})
    }
}


/*** POST Create Course Ad  */
const createCourseAd_post = async function(req, res, next)
{
    try
    {

       // Course Name and Course is auto generate 
        
        // Sanitize and validate data 

        // { course code, course name, price per hour, description, location }
        const user = req.user._id 
        const { courseCode, courseName, pricePerHour, description, fixedPrice, days, location } = req.body
        // days could be undefind, default is all days, all time 
        // location could be undefind, default is student location

        // Filter Description with regex 



        // Find CourseAd box 
        const adBox = await CourseAds.findById({ _id: req.user._id },{"_id":1})

        // no adBox 
        if( !adBox)
        {
            console.log('creating new ad box')
            // create new 
            const doc = { "_id": req.user._id }
            const newBox = new CourseAds(doc)
            const r = await newBox.save() 

            console.log(r) 
        }

        console.log('already existing ')


        // check if user uploaded the course already 
        const adExists = await CourseAds.findById({_id: req.user_id, "courses.courseCode": courseCode },{"_id": 1})
        console.log(adExists) // console.log the content 

        if( adExists )
        {
            console.log(' course exists already ')
            return res.status(200).json({"success": true, "msg":"course exists"})
        }


        console.log( typeof req.body.pricePerHour )

        if( days == [] )
        {
            days = [{"day":"mon"},{"day":"tue"},{"day":"wed"},{"day":"thur"},{"day":"fri"},{"day":"sat"},{"day":"sun"}]
        }

        // location can also be set 
        const updateQuery = { "$push": {"courses": [{ courseCode, courseName, pricePerHour, description, days, fixedPrice }] }}
        // CourseAds 
    const result = await CourseAds.updateOne({ "_id": req.user._id },updateQuery,{ "upsert": true})


        console.log(result)
        return res.status(201).json({"success": true, "msg":"successfully Created COurse ad" })
    }
    catch(err)
    {
        console.log( chalk.red(` Error occured while creating course Ad --- ${ err }`))
        return res.status(500).json({"success": false, "msg":"error occured while creating course "})
    }
}




/**GET COURSE ADS **** */
const getCourseAds_get  = async function(req, res, next)
{
    try
    {

        const result = await CourseAds.findById({"_id": req.user._id},{"courses": 1 })

        if( !result )
        {
            return res.status(200).json({"success": true, "msg":"user has no course ads "})
        }


        return res.status(200).json({"success": true, "msg":"successfully retrieved user course ads ", courseAds: result.courses })
    }
    catch(err)
    {
        console.log( chalk.red(` Error occured while getting user course Ads --- ${ err }`))
        return res.status(500).json({"success": false, "msg":"error occured while getting user course ads  "})
    }
}



// Update Course Ad
const updateCourseAd_put = async function(req, res, next)
{
    try
    {   
        //find and update
        // courseCode, courseName, pricePerHour, description, fixedPrice
        const updateQuery = { $set: { "courses.$.courseCode": req.body.courseCode, "courses.$.courseName": req.body.courseName, "courses.$.pricePerHour": req.body.pricePerHour, "courses.$.description": req.body.description, "courses.$.isFixedPrice": req.body.isFixedPrice,"courses.$.fixedPrice": req.body.fixedPrice, "courses.$.days": req.body.days, "courses.$.available": req.body.available, "courses.$.location": req.body.location }}
        const result = await CourseAds.updateOne({ "_id": req.user._id, "courses.courseCode": req.params.courseCode },updateQuery)
        
        console.log(result)
        return res.status(200).json({"success":true, "msg":"successfully updated course ad "})
    }
    catch(err)
    {
        console.log( chalk.red(` Error occured while updatiing course Ads --- ${ err }`))
        return res.status(500).json({"success": false, "msg":"error occured while updating course Ads  "})
    }
}


// Delete Course Ad 
const deleteCourseAds_delete = async function(req, res, next)
{
    try
    {
            // delete booking from Bookings Overview 
            const deleteFilter = { $pull: { "courses": {"courseCode": req.params.courseCode  } }}
            const courseADDeleted = await CourseAds.updateOne({ _id: '617741c60b16e7ac49ebe2dc'},deleteFilter)
        

        return res.status(200).json({"success": true, "msg":"delete successfull"})
    }
    catch(err)
    {
        console.log( chalk.red(` Error occured while deleting course Ads --- ${ err }`))
        return res.status(500).json({"success": false, "msg":"error occured while deleting course ads  "})
    }
}



// On or off Availability
const toggleAvailability_patch = async function(req, res, next)
{
    try
    {

    }
    catch(err)
    {

    }
}


/*GET CreateBooking */
const createBooking_post = async function(req, res, next)
{
    try
    {
        // Get user input 
        // some data is expected to be persisted from the list of tutors , like courseName, courseCode 

        // data expected to come to the backend 
        const { courseName, courseCode,  toStartLessonOn, toEndLessonOn, studentNote, tutorId, tutorPic, tutorName, studentPic, studentName, days, pricePerHour, fixedPrice, location } = req.body 

        

        if( !days )
        {
            // manually set days
        const days = [{"day":"mon"},{"day":"wed"},{"day":"fri"}] // days will save to courses 
        }
        
        
        // validate all input 
       

        //  save details summary to the student 

    
        const studentQuery = {$push: { bookingsOverview:[{ location, courseName, courseCode, tutorName, tutorId, studentId: req.user._id, sentByme: true, tutorProfilePicture: tutorPic, pricePerHour }] }}
        const student = await  Users.findByIdAndUpdate({ _id: req.user._id },studentQuery)

        
        console.log( student )
        // save details summary to tutor
        const tutorQuery = {$push: { bookingsOverview:[{ location, courseName, courseCode, studentName, studentId: req.user._id, tutorId, sentByme: false, studentProfilePicture: studentPic, pricePerHour}] }, $inc:{"bookingsCount": 1}}
        const tutor = await  Users.findByIdAndUpdate({ _id: tutorId },tutorQuery)
        console.log( tutor)


        // Check out how the upsert works, if it could upsert the document properly 
             // save main details to Bookings 
        const bookingsQuery = {$push: { bookings:[{ _id: req.user._id, tutorId, studentId: req.user._id, fixedPrice, courseCode, studentNote, studentRequestedDays: days, student_toStartLessonOn: toStartLessonOn, student_toEndLessonOn: toEndLessonOn }] }}
        const bookings = await  Bookings.findByIdAndUpdate({ _id: req.user._id },bookingsQuery,{"upsert": true})
        console.log(bookings)
    
       


        return res.status(201).json({"success": true, "msg":"created and sent booking to tutor "})

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({"success": false, "msg":" error occured while creating booking "})
    }
}





/*********************GET Bookings *******************************************/
/**********GET Bookings ***************************** */
const bookings_get = async function(req, res, next)
{   

    // Returns a list of all bookings  
        try
        {
            const result = await Users.findById({ _id: req.user._id },{"bookingsOverview": 1})
            console.log( chalk.cyan(`${ result }`)) 
            return res.status(200).json({ success: true, "msg":"successfully fetched bookings ", bookings: result.bookingsOverview })
        }catch(err)
        {
            console.log( chalk.red(`error occured while fetching bookings ${ err }`))
            return res.status(500).json({ success: false, "msg":"error occured while fetching bookings "})
        }


}


/***********************GET a single Booking *************************** */
const booking_get = async function(req, res, next)
{   

    // Returns a booking Item  
        try
        {  
            // params tutor_id, course code  
            // Expect : student_id, course_code, tutor 
            const result = await Bookings.findOne({ _id: req.user._id },{ bookings:{ $elemMatch:{"tutorId": req.params.tutorId, "courseCode": req.params.courseCode} }})
            return res.status(200).json({ success: true, "msg":"successfully fetched bookings ", bookingItem: result })
        }catch(err)
        {
            console.log( chalk.red(`error occured while fetching bookings ${ err }`))
            return res.status(500).json({ success: false, "msg":"error occured while fetching bookings "})
        }

}




/* Patch Update Booking */
const updateBooking_patch = async function(req, res, next)
{
    try
    {
         
        const {courseCode, tutorId, studentId, pricePerHour, fixedPrice, student_toStartLessonOn, student_toEndLessonOn, tutor_toStartLessonOn, tutor_toEndLessonOn, tutorNote, studentNote, studentRequestedDays, tutorRequestedDays} = req.body 


console.log('checking')


        // If update is from a tutor 
        if( req.user._id == tutorId )
        {
            // update details for tutor 
            console.log('in tutor')
            // query
            const filter = { $set:{"bookings.$.pricePerHour": pricePerHour, "bookings.$.fixedPrice": fixedPrice, "bookings.$.tutor_toStartLessonOn": tutor_toStartLessonOn, "bookings.$.tutor_toEndLessonOn": tutor_toEndLessonOn, "bookings.$.tutorNote": tutorNote, "bookings.$.tutorRequestedDays": tutorRequestedDays }}
            const updateResult = await Bookings.updateOne({"_id": studentId, "bookings.tutorId": tutorId, "bookings.courseCode": courseCode })


            return res.status(200).json({"success": true, "msg":" Updated tutor booking details "})
        }



        // If Update is from a student
        if( req.user._id == studentId )
        {

            console.log('in student')
            // update details for student
            const filter = { $set:{"bookings.$.student_toStartLessonOn": student_toStartLessonOn, "bookings.$.student_toEndLessonOn": student_toEndLessonOn, "bookings.$.studentNote": studentNote, "bookings.$.studentRequestedDays": studentRequestedDays }}
            const updateResult = await Bookings.updateOne({"_id": studentId, "bookings":{$elemMatch: {"tutorId":tutorId}}, "bookings":{$elemMatch:{"courseCode": courseCode}} },filter)
// "attendees": {$elemMatch: {email: useremail}}
            console.log(updateResult)
            return res.status(200).json({"success": true, "msg":"Updated student details "})
        }




    }
    catch(err)
    {
        console.log( chalk.red(`error occured while updating booking ${ err }`))
        return res.status(500).json({ success: false, "msg":"error occured while deleting booking  "})
    }
}




// ******************************** PASSWORD ***************************// 


// /********************POST send note student ************************************* */
// const updateStudentNote_post = async function(req, res, next)
// {   

//     // Returns a booking Item  
//         try
//         {  


//             // This method is inefficient, the entire data should be updated 
//             // 

//             // get student id, tutor id
//             const { studentId, tutorId, courseCode, studentNote } = req.body


//             console.log('in here ')
//             // update tutor update count 
//             const updateQuery = { $set: { "bookings.$.studentNote": studentNote }}
//             const result = await Bookings.updateOne({ "_id": studentId, "bookings.tutorId": tutorId , "bookings.courseCode": courseCode },updateQuery)
//             // send notification to tutor about the update 


//             return res.status(200).json({"success": true, "msg":"updated student note ", result })
//         }catch(err)
//         {
//             console.log( chalk.red(`error occured while sending student note ${ err }`))
//             return res.status(500).json({ success: false, "msg":"error occured while sending student note"})
//         }


// }


// /********************POST Update tutor note student ************************************* */
// const updateTutorNote_post = async function(req, res, next)
// {   

//     // Returns a booking Item  
//         try
//         {  

//             const { tutorId, studentId, tutorNote, courseCode } = req.body

//             // update tutor update count 
//             const updateQuery = { $set: { "bookings.$.tutorNote": tutorNote }}
//             const result = await Bookings.updateOne({ "_id": studentId, "bookings.tutorId": tutorId , "bookings.courseCode": courseCode },updateQuery)

//             // Send notification to student about the update 

//             console.log(result)
//             return res.status(200).json({"success": true, "msg":"updated tutor note ", result })
//         }catch(err)
//         {
//             console.log( chalk.red(`error occured while sending tutor Note note ${ err }`))
//             return res.status(500).json({ success: false, "msg":"error occured while sending student note"})
//         }


// }


// Other Updates like Date and time 



/**********************DELETE Booking overview Items  */

const delete_booking_delete = async function(req, res, next)
{
    try
    {

        // if the user deletes the overview, 
        // if the user deletes the main 
        
        

        // delete booking from Bookings Overview 
        const deleteFilter = { $pull: { "bookingsOverview": {"courseCode": req.params.courseCode, "tutorId": req.params.tutorId } }}
        const bookingItemDeleted = await Users.updateOne({ _id: req.user._id},deleteFilter)

        console.log(bookingItemDeleted)


        // find Booking in bookings 
        const _booking = await Bookings.findOne({ "_id": req.params.studentId},{ bookings: { $elemMatch: {"tutorId": req.params.tutorId, "courseCode": req.params.courseCode}  }})

        // modify delete count 
        _booking.bookings[0].deleteCount += 1


        if( _booking.bookings[0].deleteCount >= 2 )
        {
            // delete 
            const update = { $pull: { bookings:{ $elemMatch:{ "tutorId": req.params.tutorId, "courseCode": req.params.courseCode }}}}
            //const update = { $pull: { bookings:{ "tutorId": req.params.tutorId, "courseCode": req.params.courseCode }}}
            const deleted = await Bookings.updateOne({ _id: req.params.studentId, "bookings.tutorId": req.params.tutorId, "bookings.courseCode": req.params.courseCode },update)
            console.log("booking deleted for both users ")
        }

        // if not mark modified
        _booking.markModified('_booking.bookings[0].deleteCount')

        await _booking.save()


        // return response
        console.log('booking deleted for single user ')
        return res.status(200).json({ "success": true, "msg":"booking deleted successfully"})
    }
    catch(err)
    {
        console.log( chalk.red(`error occured while deleting booking ${ err }`))
        return res.status(500).json({ success: false, "msg":"error occured while deleting booking"})
    }
}


// Cancel Booking 
    // simply change the booking status to cancelled 
    // notify the tutor 
    // user see's the status of the booking and see's a cancel button
    // user cancels and the status is changed to cancelled
    // user can rebook
    // user can delete

// Accept Booking 
// Affecting Actions 
// User Profile 


// Cancel Booking 
const cancelBooking_patch = async function(req, res, next)
{

    try
    {
        
     
        const { tutorId, courseCode } = req.body 
          // update the status with the tutor 
          const student = await Users.updateOne({ _id: req.user._id, "bookingsOverview.courseCode": courseCode, "bookingsOverview.tutorId": tutorId },{ $set:{ "bookingsOverview.$.status":"cancelled"}})
 
        // update the status with the tutor 
        const tutor = await Users.updateOne({ _id: tutorId, "bookingsOverview.courseCode": courseCode, "bookingsOverview.tutorId": tutorId },{ $set:{ "bookingsOverview.$.status":"cancelled"}})
        return res.status(200).json({"success": true, "msg":"booking cancelled successfully "})
    }
    catch(err)
    {
        console.log('error occured while cancelling booking ')
        return res.status(500).json({"success": false, "msg":"unable to cancel booking"})
    }

}



// Decline Booking 
const declineBooking_patch = async function(req, res, next)
{

    try
    {
        const { studentId, courseCode } = req.body
     
    
          // update the status with the tutor 
          const student = await Users.updateOne({ _id: studentId, "bookingsOverview.courseCode": courseCode, "bookingsOverview.tutorId": req.user._id},{ $set:{ "bookingsOverview.$.status":"declined"}})
 
        // update the status with the tutor 
        const tutor = await Users.updateOne({ _id: req.user._id, "bookingsOverview.courseCode": courseCode, "bookingsOverview.tutorId": req.user._id },{ $set:{ "bookingsOverview.$.status":"declined"}})
        return res.status(200).json({"success": true, "msg":"booking declined successfully "})
    }
    catch(err)
    {
        console.log('error occured while declining booking ')
        return res.status(500).json({"success": false, "msg":" unable to decline booking "})
    }

}




// Accept Booking 
const acceptBooking_patch = async function(req, res, next)
{
    try
    {

        // booking updates, booking item updated 

        // change both status to accepted 
        
        const { courseCode, studentId} = req.body 
          // update the status with the student
          const student = await Users.updateOne({ studentId, "bookingsOverview.courseCode": courseCode, "bookingsOverview.tutorId": req.user._id },{ $set:{ "bookingsOverview.$.status":"accepted"}})
 
        // update the status with the tutor 
        const tutor = await Users.updateOne({ _id: req.user._id, "bookingsOverview.courseCode": courseCode, "bookingsOverview.studentId": studentId },{ $set:{ "bookingsOverview.$.status":"accepted"}})
        // awaiting payment status for tutor 
        return res.status(200).json({"success": true, "msg":"booking accepted successfully "})
        // direct the student to payment page 
    }
    catch(err)
    {
        console.log('error occured while accepting booking ')
        return res.status(500).json({"success":false, "msg":"error occured while accepting booking "})
    }
}




// update password 
const updatePassword_patch = async function(req, res, next)
{
    try
    {
        const { oldPassword, newPassword } = req.body 

        // find user 
        const user = await User.findById({ _id: req.user._id },{ password: 1 })

        if( user.isValidPassword(oldPassword) )
        {
            // save new password 
            user.password = newPassword 
            user.markModified('password')

            await user.save() 

            return res.status(200).json({"success": true, "msg":" user password saved successfully "})
        }
        else
        {
            // passwords do not match 
            return res.status(400).json({"success": true, "msg":" old and new passwords do not match"})
        }
    }
    catch(err)
    {
        console.log('error occured while updating password  ')
        return res.status(500).json({"success":false, "msg":"error occured while updating password "})
    }
}




// update profile 
const updateProfile_patch = async function(req, res, next)
{
    try
    {

        const {firstname, lastname, middlename, email, phoneNumber, university, faculty, department, level} = req.body


            // set the rest updates 
            const updateBody = { $set: {firstname, lastname, middlename, email, phoneNumber, university, faculty, department, level } }

            const result = await User.updateOne({_id: req.user._id},updateBody)

            return res.status(200).json({"success": true, "msg":"successfully updated user profile "})
           
    }
    catch(err)
    {
        console.log('error occured while updating profile ' + err )
        return res.status(500).json({"success": false, "msg":"error occured while updating profile"})
    }
}


// get profile
const userProfile_get = async function(req, res, next)
{
    try
    {

            const result = await User.findById({_id: req.user._id},{firstname: 1, lastname: 1, middlename: 1, email: 1, phoneNumber:1, university:1, faculty:1, department:1, level:1})

           return res.status(200).json({"success": true, "msg":"retrieved user profile", userProfile: result})
    }
    catch(err)
    {
        console.log('error occured while retrieving user profile ' + err )
        return res.status(500).json({"success": false, "msg":"error occured while retrieving user  profile"})
    }
}



// Connected entities 
// Logout






















//*****************************GET Notification Follow Up action ************************************ */










// BIN BIN 
async function imageUploaded(req, res, next)
{
    try
    {



        if( req.file )
        {
            
            // Picture Upload is involved 
           
            // check file extention 
            var ext = path.extname(req.file.path)
            console.log(' the extension name of the image uploaded is ' + ext )

            // file filter 
            if( ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg ')
            {
                console.log('image format not supported ') 
                return res.status(400).json({"success": false, "msg":"unsurported file extensiion"})
            }



            /****************  */
            if( req.body.fileUpload && req.body.textUpload)
            {
                // upload both text and file 
                uploadProfilePictureAndText()
            }
            else
            {
                // upload only file 
                uploadProfilePicture()
            }
            /**************** */

        }
        else
        {

            /**********   */
            // no picture , check if user wants to upload picture 
            if( req.body.fileUpload )
            {
                        // check that profile picture was not uploaded 
                        console.log('user wants to upload a profile picture but did not select ')
                        return res.status(400).json({"success": false, "msg":" please select a profile picture for upload  "})
            }
            else
            {
                // upload only the text 
                uploadText() 
            }
            /**************  */
           
        }
       
    }
    catch(err)
    {
        console.log(' error occured while checking image upload  \n' + err ) 
        return res.status(500).json({"success": false, "msg":"error occured while uploading profile picture from server "})
    }
   
}



// picture functions 
const uploadProfilePictureAndText = async function()
{
    // database operations 
    try
    {

        if( req.file )
        {
            console.log(' there is a file ')
            if( req.error)
            {
                    console.log("error occured while uploading image " + req.errorMsg)
                    return res.status(400).json({"success": false, "msg":"not a supported media type "})
            }
            else
            {
                console.log(req.error ) 
                    console.log(" image upload successfull ")
                    console.log(req.file.path) // file path  
                    const result = await cloudinary.uploader.upload(req.file.path, { timeout: 900000})
                    console.log(result) 

                    // save details for user 
                    const user_result = await User.findOne({ _id: req.user._id})

                    if( !user_result )
                    {
                        console.log('could not find user ')
                    }

                    user_result.profilePicture = result.secure_url
                    user_result.profile_picture_cloudinary_id = result.public_id 

                    user_result.markModified('profilePicture')
                    user_result.markModified('profile_picture_cloudinary_id')

                    // update texts 
                       // loop trough and modify
                       for( var [key, value] of Object.entries(req.body.textUpdates) )
                       {
                           user_result.key = value 
                           user_result.markModified(key)
                       }

                       
                   await user_result.save() 

                   console.log('created user profile picture ')

                    // save user profile picture 

                    return res.status(200).json({"success": true,"msg":"uploaded image " })
            }

        }
        else
        {
            console.log(' there is no file ') 
            return res.status(400).json({"success": false, "msg":"no file uploaded "})
        }

        
    }
    catch(err)
    {
            console.log(err) 
            return res.status(500).send('error occured while uploading file ')
    }
 
}

// upload profile picture 
const uploadProfilePicture = async function()
{
    // database operations     
    try
    {

        if( req.file )
        {
            console.log(' there is a file ')
           
           
                console.log(req.error ) 
                    console.log(" image upload successfull ")
                    console.log(req.file.path) // file path  
                    const result = await cloudinary.uploader.upload(req.file.path, { timeout: 900000})
                    console.log(result) 

                    // save details for user 
                    const user_result = await User.findOne({ _id: req.user._id})

                    if( !user_result )
                    {
                        console.log('could not find user ')
                    }

                    user_result.profilePicture = result.secure_url
                    user_result.profile_picture_cloudinary_id = result.public_id 

                    user_result.markModified('profilePicture')
                    user_result.markModified('profile_picture_cloudinary_id')


                   await user_result.save() 

                   console.log('created user profile picture ')

                    // save user profile picture 

                    return res.status(200).json({"success": true,"msg":"uploaded image " })
            

        }
        else
        {
            console.log(' there is no file ') 
            return res.status(400).json({"success": false, "msg":"no file uploaded "})
        }

        
    }
    catch(err)
    {
            console.log(err) 
            return res.status(500).send('error occured while uploading image file ')
    }
 
}



// upload text 
const uploadText = async function()
{
    // database operations 
    try
    {


                    // save details for user 
                    const user_result = await User.findOne({ _id: req.user._id})

                    if( !user_result )
                    {
                        console.log('could not find user ')
                    }

                
                
                    // loop trough and modify
                    for( var [key, value] of Object.entries(req.body.textUpdates) )
                    {
                        user_result.key = value 
                        user_result.markModified(key)
                    }

                   await user_result.save() 

                   console.log('saved user text updates  ')

                    return res.status(200).json({"success": true,"msg":"saved user text updates " })
        
    }
    catch(err)
    {
            console.log(err) 
            return res.status(500).send('error occured while uploading file ')
    }
 
}



/// PICTURE 
/// deps 

// multer
const multer= require('multer')
const { CloudinaryStorage} = require('multer-storage-cloudinary') 

            // storage 
            const storage = new CloudinaryStorage
            (
                {
                    cloudinary: cloudinary,
                    params:
                    {
                        folder:"DEV"
                    }
                }
            )
            const path = require('path')

        // multer setup 
        const upload = multer({ storage: storage, fileFilter: function(req, file, cb){ 

            
                console.log('file was uploaded ') 
                const ext = path.extname(file.originalname)
                console.log(ext) 
                if( ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' )
                {
                        cb(new Error('file format not supported'),false)
                        return
                }

                        cb(null, true )
                        return 
           
        }  })


const multerErrorChecker = async function( req, res, next){

   await upload(req, res, (err)=>{ 
        if( err instanceof multer.MulterError )
        {
            console.log('error occured during multer upload ')
        }
    })

} 





module.exports = { dashboard_get, notifications_get, createCourseAd_get,createCourseAd_post, createBooking_post, bookings_get, booking_get, searchForCourseLesson_get, delete_booking_delete, getCourse_get ,
    uploadProfilePicture_patch, updateProfilePicture_patch, cancelBooking_patch, declineBooking_patch,
    getCourseAds_get, acceptBooking_patch, userProfile_get, updateProfile_patch, deleteProfilePicture_patch,multerErrorChecker, updateCourseAd_put, deleteCourseAds_delete, updateBooking_patch, updatePassword_patch, imageUploaded}




    // Search Sorting 