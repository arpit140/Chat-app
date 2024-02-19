
const express = require('express')
// const path = require('path')
const UserController = require('../Controllers/UserController')
const GroupController = require('../Controllers/GroupController')
const router = express.Router()



router.post('/signup', UserController.signup)
router.post('/login',UserController.login)
router.get('/current', UserController.getCurrentUserInfo)


router.post('/group/create', GroupController.createGroup)
router.get('/group/list', GroupController.getGroupList)
router.delete('/group/delete/:id', GroupController.deleteGroup)

module.exports = router 