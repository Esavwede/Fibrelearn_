

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
const { createCourseAd_post, courseAds_get, courseAd_get, updateCourseAd_patch, deleteCourseAd_delete, getCourseAds_post, createCourseAd_get }  = require('./middlewares/CourseAd/CourseAd')
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



/*GET View Course Ads for tutor */
userRouter.get('/courseAds',authenticateToken,courseAds_get)


/*GET view Course Ad */
userRouter.get('/courseAd/:courseCode',authenticateToken,courseAd_get) 


/*GET Create Course Ad */
userRouter.get('/courseAd',authenticateToken,createCourseAd_get) 


/*PATCH Update Course Ad */
userRouter.patch('/courseAd',authenticateToken,updateCourseAd_patch)


/*DELETE Delete Course Ad */
userRouter.delete('/courseAd/:courseAd_id',authenticateToken,deleteCourseAd_delete)


/*POST Get Course code and title */ 
userRouter.post('/getCourse',authenticateToken,getCourseCode_post) 


/*POST Get Course Ads*/
userRouter.post('/courseAds',authenticateToken,getCourseAds_post)  


/*POST Create Booking */
userRouter.post('/booking',authenticateToken,createBooking_post) 

/*GET view Bookings */
userRouter.get('/bookings',authenticateToken,bookings_get) 


/*GET view Booking */
userRouter.get('/booking/:booking_id',authenticateToken,booking_get) 


/*DELETE Booking */
userRouter.delete('/booking/:booking_id',authenticateToken,booking_delete)


userRouter.patch('/bookingRenegotiation',authenticateToken,renegotiateBooking_patch) 

/*PATCH Update Booking*/
userRouter.patch('/booking',authenticateToken,booking_patch) /* Not Needed */ 



/*** Highly Test zone  */



/*POST update Booking State*/
userRouter.post('/bookingStateUpdate',authenticateToken,updateBookingState_post) 


/*POST update Bookings Count*/
userRouter.patch('/bookingsCount',authenticateToken,updateBookingsCount_patch)

userRouter.patch('/declineBooking',authenticateToken,declineBooking_patch) 

userRouter.patch('/cancelBooking',authenticateToken,cancelBooking_patch) 

// accept 

module.exports = { userRouter }