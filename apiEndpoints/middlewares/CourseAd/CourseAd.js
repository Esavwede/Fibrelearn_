// Modules 
const { createServerError } = require('../../../UtilityFunctions/ServerError/server_error')
const  CourseAd = require('../../../models/CourseAds') 
const TutorProfile = require('../../../models/TutorProfile')



const createCourseAd_get = async function(req, res, next)
{
    try 
    {
        const tutor_id = req.user._id 
        
        const tutorDetails = await TutorProfile.findById({ _id: tutor_id },{ _id: 0, tutor_rating: 1, isVerified: 1 }) 

        if( tutorDetails === null ) return res.status(200).json({"success": true, "msg":" no tutor profile found, create tutor profile and get verified to create course ad "})
        return res.status(200).json({"success": true, tutorDetails })

    }
    catch(err)
    {
        createServerError('error occured while getting course creation details ',err,res)
    }
}




const createCourseAd_post = async function(req, res, next)
{
    try
    {

     
        const
            {
            courseTitle,
            courseCode,
            price,
            description,
            location, 
            tutor_rating,
            tutor_is_verified
            } = req.body 

            const tutor_firstname = req.user.firstname 
            const tutor_profile_picture_url = req.user.profile_picture_url 
            const tutor_id = req.user._id 

            /* Check if course Ad exists Already */ 
            const courseAdAlreadyCreated = await CourseAd.findOne({ courseCode, tutor_id})

            if( courseAdAlreadyCreated ) return res.status(400).json({"success": true, "msg":" course Ad created already "})

            const doc = { tutor_id, courseTitle, courseCode, price, description, location, tutor_rating, tutor_firstname, tutor_profile_picture_url, tutor_is_verified }
            const newCourseAd = new CourseAd(doc)
            const courseCreated = await newCourseAd.save() 

            if( !courseCreated ) 
            {
                console.log('error occured while creating courses ')
                console.log( courseCreated ) 

                return res.status(500).json({"success": false, "msg":"error occured while creating course ad "})
            }


            return res.status(201).json({"success": true, "msg":"successfully created course Ad"})
    }
    catch(err)
    {
        createServerError('error occured while creating course Ad',err,res)
    }
}




const courseAd_get = async function(req, res, next)
{
    try 
    {

        const tutor_id = req.user._id 

        const courseAd = await CourseAd.find({ tutor_id },{ _id: 1, courseTitle: 1, courseCode: 1, price: 1, description: 1, location: 1})

        if( !courseAd )
        {
            console.log('error occured while fetching course ad ')
            console.log(courseAd) 
            return res.status(500).json({"success":false, "msg":"error occured while fetching course Ad"})
        }


        return res.status(200).json({ "success": true, courseAd })
    }
    catch(err)
    {
        createServerError('error occured while fetching course ad ',err,res)
    }
}



/**
 * 
 * Wish list 
 * 
 * once a course ad is created it is saved to course ads 
 * and it is also saved to course ads preview for the tutor 
 */


const updateCourseAd_patch = async function(req, res, next)
{
    try 
    {
        const tutor_id = req.user._id 
        const courseCode = req.body.courseCode 
        const updateBody = req.body 

        delete updateBody.courseCode 

        const updateResult = await CourseAd.updateOne({ tutor_id, courseCode },{ $set: updateBody })

        if( !updateResult ) return res.status(500).json({ "success": true, "msg":"error occured while updating course Ad "})

        return res.status(200).json({"success": true, "msg":"successfully updated course Ad "})

    }
    catch(err)
    {
        createServerError('error occured while updating course ad ',err,res)
    }
}








const deleteCourseAd_delete = async function(req, res, next)
{
    try 
    {
        const courseAd_id = req.params.courseAd_id 

        const deleteResult = await CourseAd.deleteOne({ _id: courseAd_id })

        if( !deleteResult ) return res.status(500).json({"success": false, "msg":"error occured while deleting course Ad "})

        return res.status(200).json({"success": true, "msg":" successfully deleted course Ad "})
    }
    catch(err)
    {
        createServerError("error occured while creating course Ad ",err,res)
    }
}





const getCourseAds_post = async function(req, res, next)
{
    try
    {

        const courseCode = req.body.courseCode 
        const price = req.body.price 
        const rating = req.body.rating 
        const limit = req.body.limit 
        const skip  = req.body.skip 
        

        const priceStart =  parseInt(price.from)
        const priceStop =  parseInt(price.to)
        const ratingStart =  parseInt(rating.from)
        const ratingStop =   parseInt(rating.to)

console.log( priceStart )
console.log( typeof priceStart )

 

        const match = {   courseCode, tutor_rating:{ "$gte": ratingStart , "$lte": ratingStop },    price:{ "$gte": priceStart, "$lte": priceStop }, tutor_is_verified: false }

        const project = 
        {
            _id: 0, 
            courseCode: 1,
            courseName: 1,
            price: 1,
            price_negotiable: 1,
            tutor_id: 1
        }

        const filter = 
        {   
            skip, 
            limit
        }


 

        const courseAds = await CourseAd.find(
            match,
            project,
            filter)


        console.log( courseAds )  

        if( courseAds === null )
        {
            console.log('no course ad for this course ')
            return res.status(200).json({"success": true, "msg":" no course ad available for the specified course "})
        }


        return res.status(200).json({"success": true, courseAds })
        
    }
    catch(err)
    {
        createServerError('error occured while fetching course ads for this course ',err,res)
    }
}


module.exports = { createCourseAd_get, createCourseAd_post, courseAd_get, updateCourseAd_patch, deleteCourseAd_delete, getCourseAds_post } 