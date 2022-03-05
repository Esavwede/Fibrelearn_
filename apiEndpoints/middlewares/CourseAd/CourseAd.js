// Modules 
const { createServerError } = require('../../../UtilityFunctions/ServerError/server_error')
const  CourseAd = require('../../../models/CourseAds') 
const TutorProfile = require('../../../models/TutorProfile')



const createCourseAd_get = async function(req, res, next)
{
    try 
    {
        const tutor_id = req.user._id 
        
        const tutorDetails = await TutorProfile.findById({ _id: tutor_id },{ _id: 0, tutor_rating: 1, isVerified: 1, commissionRate: 1 }) 

        if( tutorDetails === null ) return res.status(200).json({"success": true, "msg":" no tutor profile found, create tutor profile and get verified to create course ad "})
        return res.status(200).json({"success": true, "msg":"user can create course Ad", userData: tutorDetails })

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

     
        var 
            {
            courseTitle,
            courseCode,
            fixedPrice,
            fixedPriceValue,
            timePackages,
            description,
            location
            } = req.body 

            const tutor_firstname = req.user.firstname 
            const tutor_profile_picture_url = req.user.profile_picture_url 
            const tutor_id = req.user._id 

            /* Tutor Commission rate */ 
            const tutorData = await TutorProfile.findById({ _id: tutor_id},{ _id: 0, commissionRate: 1, tutor_rating: 1, isVerified:1, reviews_count: 1 })
                        

            if( tutorData === null ) return res.status(200).json({"Success": true, "msg":" could not find tutor commission rate "})


            console.log( tutorData + ' tutor Data here ')
            var tutorCommissionRate = tutorData.commissionRate
            const tutor_rating = tutorData.tutor_rating
            const tutor_is_verified = tutorData.isVerified 
            const number_of_reviews = tutorData.number_of_reviews 


            
            /* Check if course Ad exists Already */ 
            const courseAdAlreadyCreated = await CourseAd.findOne({ courseCode, tutor_id})
            if( courseAdAlreadyCreated ) return res.status(400).json({"success": true, "msg":" course Ad created already "})



            // evaluate final price 
            if( fixedPrice )
            {


                // check and verify tutor rate 
                console.log('---------------------')
                console.log('fixedPriceValue ' + fixedPriceValue + ' type: ' + typeof fixedPriceValue ) 
                console.log('tutor commissionRate ' + tutorCommissionRate + ' type: ' + typeof tutorCommissionRate ) 
                console.log('-----------------------')
                var fixedPriceCommissionAmount = Math.floor( (fixedPriceValue) * ( tutorCommissionRate  / 100 ) )
                fixedPriceValue = fixedPriceCommissionAmount + fixedPriceValue 
                console.log(' type of commissionAmount ' + fixedPriceCommissionAmount )


                // create and save course ad 
                const doc = { tutor_id, courseTitle, courseCode, description, location, tutor_rating, tutor_firstname,
                    tutor_profile_picture_url, tutor_is_verified, number_of_reviews, fixedPrice, fixedPriceValue, fixedPriceCommissionAmount  }

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
            else 
            {

                const timePackagesLength = timePackages.length 

                
                for( let i = 0; i < timePackagesLength; i++ )
                {
                    var commissionAmount = ( timePackages[i].price ) * ( tutorCommissionRate / 100 )
                    timePackages[i].price = timePackages[i].price + commissionAmount 
                    timePackages[i].commissionAmount = commissionAmount 
                }
                
                                // create and save course ad 
                                const doc = { tutor_id, courseTitle, courseCode, description, location, tutor_rating, tutor_firstname,
                                    tutor_profile_picture_url, tutor_is_verified, number_of_reviews, fixedPrice, timePackages }
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


    }
    catch(err)
    {
        console.log(err) 
        createServerError('error occured while creating course Ad',err,res)
    }
}




const courseAds_get = async function(req, res, next)
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



const courseAd_get = async function(req, res, next)
{
    try
    {
        const user_id = req.user._id 
        const courseCode = req.params.courseCode 

        const courseAd = await CourseAd.findOne({ tutor_id: user_id, courseCode })
        return res.status(200).json({"success": true, courseAd})
    }
    catch(err)
    {
        createServerError('error occured while getting course Ad',err,res)
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

        const description = req.body.description
        const location = req.body.location 
        const price = req.body.price 


        const updateResult = await CourseAd.updateOne({ tutor_id, courseCode },{ $set:{ description, location, price}})
    
        console.log(updateResult)

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
        var price = req.body.price 
        var rating = req.body.rating 
        const limit = req.body.limit 
        const skip  = req.body.skip 
        
        console.log('---')
        console.log(price) 


        if( price === undefined )
        {
            price = {} 
            price.from = 0
            price.to = 1000000
        }

        if( rating === undefined )
        {
            rating = {} 
            rating.from = 0
            rating.to = 5 
        }

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


module.exports = { createCourseAd_get, createCourseAd_post, courseAds_get, courseAd_get, updateCourseAd_patch, deleteCourseAd_delete, getCourseAds_post } 