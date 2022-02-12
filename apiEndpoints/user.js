

// Express 
const express = require('express')
const userRouter  = express.Router() 


// models 
const User = require('../models/User') 

// packages 
const multerUploader = require('../setup/multer')

// Middlewares 
const { signup_post } = require('./middlewares/Signup/signupMiddleware') // SignUp
const { loginValidator, login_post  } = require('./middlewares/Login/loginMiddleware')//Login
const { authenticateToken, getNewAccessToken } = require('./middlewares/Token/token')
const { dashboard_get } = require('./middlewares/User/dashboard')
const { verifyEmailCode } = require('./middlewares/Email/emailVerification')
const { personnalProfile_get, personnalProfile_patch, tutorProfile_get, tutorProfile_patch, tutor_verification_image_patch, view_tutorProfile_get } = require('./middlewares/User/profile')
const { createCourseAd_post, courseAd_get, updateCourseAd_patch, deleteCourseAd_delete, getCourseAds_post, createCourseAd_get }  = require('./middlewares/CourseAd/CourseAd')
const { getCourseCode_post } = require('./middlewares/Course/Course')
const { createBooking_post, bookings_get, booking_get, booking_patch, booking_delete, updateBookingState_post,
    updateBookingsCount_patch, renegotiateBooking_patch, declineBooking_patch,
cancelBooking_patch} = require('./middlewares/Booking/Booking')


const path = require('path')


     
/* POST signup*/
userRouter.post('/signup',signup_post)

/* POST Login*/
userRouter.post('/login',loginValidator,login_post)

/* GET dashboard */
userRouter.get('/',authenticateToken,dashboard_get)

/*GET Verify Email Code */
userRouter.get('/verifyEmail/:verificationCode',verifyEmailCode)

/*GET personnal Profile */
userRouter.get('/profile',authenticateToken,personnalProfile_get)

/*PATCH personnal Profile */
userRouter.patch('/profile',authenticateToken,personnalProfile_patch) // Current 

/*GET view tutor Profile */
userRouter.get('/tutorProfile/:tutorId',authenticateToken,view_tutorProfile_get)

/*GET Tutor Profile */
userRouter.get('/tutorProfile',authenticateToken,tutorProfile_get) 

/*PATCH Tutor Profile*/
userRouter.patch('/tutorProfile',authenticateToken,tutorProfile_patch) 

/** Image Verification  */
userRouter.patch('/tutorProfile/verificationImages',tutor_verification_image_patch) 


/*Post Create Course Ad */
userRouter.post('/courseAd',authenticateToken,createCourseAd_post)



/*GET View Course Ad */
userRouter.get('/courseAds',authenticateToken,courseAd_get)


/*GET Create Course Ad */
userRouter.get('/courseAd',authenticateToken,createCourseAd_get) 


/*PATCH Update Course Ad */
userRouter.patch('/courseAd',authenticateToken,updateCourseAd_patch)


/*DELETE Delete Course Ad */
userRouter.delete('/courseAd/:courseAd_id',authenticateToken,deleteCourseAd_delete)


/*POST Get Course Code */ 
userRouter.post('/getCoursecode',authenticateToken,getCourseCode_post) 


/*POST Get Course Ads*/
userRouter.post('/courseAds',authenticateToken,getCourseAds_post)  


/*POST Create Booking */
userRouter.post('/booking',authenticateToken,createBooking_post) 

/*GET view Bookings */
userRouter.get('/bookings',authenticateToken,bookings_get) 


/*GET view Booking */
userRouter.get('/booking/:booking_id',authenticateToken,booking_get) 


/*PATCH Update Booking*/
userRouter.patch('/booking',authenticateToken,booking_patch) 


/*DELETE Booking */
userRouter.delete('/booking/:booking_id',authenticateToken,booking_delete)


/*POST update Booking State*/
userRouter.post('/bookingStateUpdate',authenticateToken,updateBookingState_post) 



/*POST update Bookings Count*/
userRouter.patch('/bookingsCount',authenticateToken,updateBookingsCount_patch) 

userRouter.patch('/bookingRenegotiation',authenticateToken,renegotiateBooking_patch) 


userRouter.patch('/declineBooking',authenticateToken,declineBooking_patch) 

userRouter.patch('/cancelBooking',authenticateToken,cancelBooking_patch) 


// /*PATCH  Upload profile picture */
// userRouter.patch('/uploadProfilePicture', upload.single("profilePicture"), imageUploaded, uploadProfilePicture_patch)

// /* PATCH update profile picture  */
// userRouter.patch('/updateProfilePicture',authenticateToken,upload.single("selectedImage"),updateProfilePicture_patch)

// /* Delete update profile picture  */
// userRouter.patch('/deleteProfilePicture',authenticateToken,upload.single("selectedImage"),deleteProfilePicture_patch)



// /* GET notifications */ 
// userRouter.get('/notifications/:userId',authenticateToken, notifications_get )


// /* GET Course Lessons */
// userRouter.get('/courseLessons/:courseCode/:limit/:skip',authenticateToken,searchForCourseLesson_get)

// /* GET Create Course */
// userRouter.get('/createCourseAd',authenticateToken,createCourseAd_get)

// /*PUT Create Course Ad */ 
// userRouter.put('/createCourseAd',authenticateToken,createCourseAd_post)



// /*POST create booking */
// userRouter.patch('/bookTutor',authenticateToken,createBooking_post)


// /*GET get list of bookings */
// userRouter.get('/bookings',authenticateToken,bookings_get)



// /*GET get single booking */
// userRouter.get('/bookings/:tutorId/:courseCode',authenticateToken,booking_get)


// /*DELETE Delete Booking */
// userRouter.delete('/bookings/delete/:studentId/:tutorId/:courseCode',authenticateToken,delete_booking_delete)


// /*GET getCourse*/
// userRouter.get('/getCourse/:facultyCode/:courseCode/:skip/:limit',authenticateToken,getCourse_get)


// /*Patch Cancel Booking */
// userRouter.patch('/bookings/cancelBooking',authenticateToken,cancelBooking_patch)

// /*Patch Decline Booking */
// userRouter.patch('/bookings/declineBooking',authenticateToken,declineBooking_patch)

// /*Patch  Accept Booking */
// userRouter.patch('/bookings/acceptBooking',authenticateToken,acceptBooking_patch)

// /*Get User Profile */
// userRouter.get('/profile',authenticateToken,userProfile_get)


// /*PUT Update User profile */
// userRouter.put('/updateProfile', upload.single("profilePicture"), imageUploaded,updateProfile_patch)


// /**GET User Course Ads  */
// userRouter.get('/courseAds',authenticateToken, getCourseAds_get)

// /**PUT Update user course Ad  */
// userRouter.put('/courseAds/update/:courseCode',authenticateToken, updateCourseAd_put)


// /** DELETE Delete Course Ads  */
// userRouter.delete('/courseAds/delete/:courseCode',authenticateToken, deleteCourseAds_delete)


// userRouter.patch('/bookings/update',authenticateToken, updateBooking_patch )

// userRouter.patch('/profile/upatePassword',authenticateToken,updatePassword_patch) 



module.exports = { userRouter }