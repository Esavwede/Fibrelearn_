

const express = require('express')
const apiRouter = express.Router()

const { userRouter } = require('./user')

apiRouter.use('/',userRouter)
module.exports = { apiRouter }