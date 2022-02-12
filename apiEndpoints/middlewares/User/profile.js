const { createServerError } = require('../../../UtilityFunctions/ServerError/server_error')
const User = require('../../../models/User')
const TutorProfile = require('../../../models/TutorProfile')


// Image Upload 
const  cloudinary = require('../../../UtilityFunctions/Image/cloudinary')
const  upload =  require('../../../UtilityFunctions/Image/multer')

async function patchUpdate(model,req)
{

 
    const findResult = await model.findById({ _id: req.body.user_id })


    if(  !findResult ) return res.status(400).json({"success":false, "msg":" invalid user id "})

    // req.body = { updates:['firstname','lastname'], firstname:'', lastname:'' }

    var i, temp

    const updates = req.body.updates 
    for( update of updates )
    {
        var x = updates 
        console.log( eval('findResult.x') ) 
    }

    for( i = 0; i < req.body.updates; i++ )
    {
       var temp = `findResult.${req.body.updates[i]} = ${req.body.updates[i]}`
        var temp2 = `findResult.markModified(${req.body.updates[i]})`
        eval(temp)
        eval(temp2)

        findResult[req.body.updates[i]] = req.body.updates[i]
    }

    const updateResult = await findResult.save() 
    console.log(` update result : ${ updateResult }`)
    if( !updateResult ) return res.status(500).json({"success":false, "msg":"error occured during update "})

    return updateResult 
}





const personnalProfile_get = async function(req, res, next)
{
        try
        {

            console.log( req.user._id )
            console.log( typeof req.user._id ) 

            
            const user = await User.findById({ _id: req.user._id },{ firstname: 1, lastname: 1, age: 1, sex: 1, phone_number: 1, email: 1, 
                                                location: 1, location_x_cord: 1, location_y_cord: 1, university: 1, department: 1, level:1 })


            if( !user ) return res.status(400).json({"success": false, "msg":"could not get user profile "})

            return res.status(200).json({"success": true, userData: user })
        }
        catch(err)
        {
            createServerError('error occured while getting personal profile',err,res)
        }
}




const personnalProfile_patch = async function(req, res, next)
{
        try
        {
             /* 
            
            */

            const { profile_picture_url, lastname, firstname, password, phone_number, age, sex, email, level, department, university   } = req.body 
            
            const updateBody = { profile_picture_url, lastname, firstname, password, phone_number, age, sex, email, level, department, university }
            const profileUpdateResult = await User.findByIdAndUpdate({ _id: req.user._id }, updateBody )

            if( !profileUpdateResult ) return res.status(500).json({"success": false,"msg":"error occured while updating user profile"})

            console.log(' update successfull ')
            console.log( profileUpdateResult ) 
            return res.status(200).json({"success": true, userData: profileUpdateResult })
        }
        catch(err)
        {
            createServerError('error occured while updating personal profile',err,res)
        }
}



const view_tutorProfile_get = async function(req, res, next)
{
    try
    {
        const tutor_id = req.params.tutorId 
        const filter = { _id: 0, bio: 1, ratings: 1, reviews_count: 1, 
            isVerified: 1, isAvailable: 1, profile_picture_url: 1 }

        const tutorProfile = await TutorProfile.findOne({ _id: tutor_id },filter)

        if( !tutorProfile )
        {
            console.log("error occured while finding tutor profile for  student ")
            console.log( tutorProfile ) 
            return res.status(500).json({"success": false, "msg":"error occured while finding tutor profile for student "})
        }

        return res.status(200).json({"success": true, tutorProfile })
    }
    catch(err)
    {
        createServerError('error occured while trying to fetch tutor profile for student ',err,res)
    }
}


const tutorProfile_get = async function(req, res, next)
{
    try 
    {

      
            const tutorProfile  =  await  TutorProfile.findById({ _id: req.user._id },{ _id: 0, bio: 1, ratings: 1, reviews_count: 1,
                 course_ads_count: 1, isVerified: 1, isAvailable: 1, student_preferences: 1  })

            
                    const userData =  {  bio: false, ratings: false, reviews_count: false,
                    course_ads_count: false, isVerified: false, isAvailable: false, student_preferences: false }
                    


                    console.log(tutorProfile) 
                    

                    if( tutorProfile === null )
                    {
                        const doc = { _id: req.user._id } 
                        const newTutorProfile = new TutorProfile(doc)
                        const creationResult = await newTutorProfile.save()

                        if( !creationResult ) return res.status(500).json({"success":"error occured while creating profile for new user "})
                        
                        
                        return res.status(200).json({ "success": true, "msg":" successfully fetched tutor profile ", userData })
                        
                    }



            if( !tutorProfile ) return res.status(500).json({"success": false, "msg":"error occured while creating new tutor profile after not being found" })

            return res.status(200).json({"success": true, userData: tutorProfile })
     

     
    }catch(err)
    {
        createServerError('error occured while getting tutorProfile',err,res) 
    }
}




const tutorProfile_patch = async function(req, res, next)
{
    try
    {
        // Tutor Profile not null 
                   // tutorProfile Update 
                   const { bio, profile_picture_url, isAvailable, student_preferences }  = req.body 

                   const updateBody = 
                   {
                       $set:
                       {
                           bio,
                           profile_picture_url,
                           isAvailable,
                           student_preferences
                       }
                   }
       
       
                   const updateResult = await TutorProfile.findByIdAndUpdate({ _id: req.user._id },updateBody) 
                   
                   if( !updateResult ) return res.status(500).json({"success": false, "msg":"error occured while while updating tutor profile "})
       
                   console.log(' tutor profile updated successfully ')
       
                   return res.status(200).json({"success": true, "msg":"tutor profile update successfull "}) 
    }catch(err)
    {
        createServerError('error occured while updating your tutoring profile',err,res)
    }
}





const tutor_verification_image_patch = async function(req, res, next)
{
    try
    {
     
        const imageUploaded = await cloudinary.uploader.upload(req.file.path)
        console.log( imageUploaded ) 

        if( !imageUploaded ) return res.status(500).json({"success": false, "msg":"error occured while uploading image "})

        // determine the image that was uploaded 
        if( req.originalUrl === 'api/user/tutorProfile/image/id' )
        {
            // update status of the uploaded file 
            const tutorProfile = await TutorProfile.findById({ _id: req.user._id },{ _id: 0, "verification.id_image_url": 1, "verification.id_image_id": 1, "verification.id_image_uploaded": 1,
                "verification.result_image_uploaded": 1,  "verification.selfie_image_uploaded": 1,
                "verification.upload_complete": 1, "verification.upload_complete_date": 1 })

            if( !tutorProfile ) return res.status(500).json({"success": false, "msg":"could not find tutor profile "})
            
                // update just uploaded image , url, id, uploaded
                tutorProfile['verification.id_image_url'] = imageUploaded.secure_url // get url 
                tutorProfile['verification.id_image_id'] = imageUploaded.public_id // get id 
                tutorProfile['verification.id_image_uploaded'] = true


                if( tutorProfile['verification.id_image_uploaded'] && tutorProfile['verification.result_image_uploaded']  && tutorProfile['verification.selfie_image_uploaded'])
                {
                    tutorProfile['upload_complete'] = true 
                    tutorProfile['upload_complete_date'] = Date.now() 
                }


                await tutorProfile.save()
                // if the status of other images are uploaded, set uploads to complete 
            return res.status(201).json({"success": true, "msg":" image uploaded successfully "})
        }

        if( req.originalUrl === 'api/user/tutorProfile/image/result' )
        {
          // update status of the uploaded file 
          const tutorProfile = await TutorProfile.findById({ _id: req.user._id },{ _id: 0, "verification.result_image_url": 1, "verification.result_image_id": 1, "verification.result_image_uploaded": 1,
          "verification.id_image_uploaded": 1,   "verification.selfie_image_uploaded": 1,
         "verification.upload_complete": 1, "verification.upload_complete_date": 1 })

      if( !tutorProfile ) return res.status(500).json({"success": false, "msg":"could not find tutor profile "})
      
          // update just uploaded image , url, id, uploaded
          tutorProfile['verification.result_image_url'] = imageUploaded.secure_url // get url 
          tutorProfile['verification.result_image_id'] = imageUploaded.public_id // get id 
          tutorProfile['verification.result_image_uploaded'] = true


          if( tutorProfile['verification.id_image_uploaded'] && tutorProfile['verification.result_image_uploaded']  && tutorProfile['verification.selfie_image_uploaded'])
          {
              tutorProfile['upload_complete'] = true 
              tutorProfile['upload_complete_date'] = Date.now() 
          }


          await tutorProfile.save()
          // if the status of other images are uploaded, set uploads to complete 
      return res.status(201).json({"success": true, "msg":" image uploaded successfully "})
        }

        if( req.originalUrl === 'api/user/tutorProfile/image/selfie' )
        {
        // update status of the uploaded file 
        const tutorProfile = await TutorProfile.findById({ _id: req.user._id },{ _id: 0, "verification.id_image_uploaded": 1,
        "verification.result_image_uploaded": 1, "verification.selfie_image_uploaded": 1,
        "verification.selfie_image_id": 1,  "verification.selfie_image_url": 1, "verification.upload_complete": 1, "verification.upload_complete_date": 1 })

    if( !tutorProfile ) return res.status(500).json({"success": false, "msg":"could not find tsutor profile "})
    
        // update just uploaded image , url, id, uploaded
        tutorProfile['verification.selfie_image_url'] = imageUploaded.secure_url // get url 
        tutorProfile['verification.selfie_image_id'] = imageUploaded.public_id // get id 
        tutorProfile['verification.selfie_image_uploaded'] = true


        if( tutorProfile['verification.id_image_uploaded'] && tutorProfile['verification.result_image_uploaded']  && tutorProfile['verification.selfie_image_uploaded'])
        {
            tutorProfile['upload_complete'] = true 
            tutorProfile['upload_complete_date'] = Date.now() 
        }


        await tutorProfile.save()
        // if the status of other images are uploaded, set uploads to complete 
    return res.status(201).json({"success": true, "msg":" image uploaded successfully "})
        }


    }catch(err)
    {
        createServerError('error occured while uploading tutor verification file ',err,res)
    }
}

module.exports = { personnalProfile_get, personnalProfile_patch, tutorProfile_get, tutorProfile_patch, tutor_verification_image_patch, view_tutorProfile_get } 