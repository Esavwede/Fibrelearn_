
// Modules 
const { createServerError } = require('../../../UtilityFunctions/ServerError/server_error')


// Models 
const UnibenCourses = require('../../../models/UnibenCourses')


const getCourseCode_post = async function(req, res, next)
{
    try
    {   
        const courseCode = req.body.courseCode.trim() 
        const faculty = req.body.faculty.trim()
        const limit = req.body.limit 

        const pipeline = 
        [
            { $match: { faculty }},
            { $unwind: "$courses" },
            { $match: { "courses.courseCode": { $regex: new RegExp('^'+courseCode+'.*') }}},
            { $limit: limit}, 
            { $project: { _id: 0, faculty: 0 }}
        ]

        const searchResult = await UnibenCourses.aggregate(pipeline)

        const coursesArray = [] 

        for( result of searchResult )
        {
            coursesArray.push(result.courses)
        }

        console.log(coursesArray) 


        return res.status(200).json({"success": true, "msg":" successfully got coure Ads ", coursesArray })
    }
    catch(err)
    {
        createServerError('error occured while fetching course Code from the server ',err,res)
    }
}




module.exports = { getCourseCode_post }