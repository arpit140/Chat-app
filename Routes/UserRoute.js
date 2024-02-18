
const express = require('express')
// const path = require('path')
const UserController = require('../Controllers/UserController')
const router = express.Router()



router.post('/signup', UserController.signup)
router.post('/login',UserController.login)
router.get('/current', UserController.getCurrentUserInfo)

module.exports = router 