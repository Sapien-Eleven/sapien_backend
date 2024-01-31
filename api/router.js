const express = require('express')
const router = express.Router();
const Controller = require('./controller')

router.post('/signup', Controller.signup)
router.post('/login', Controller.login)
router.post('/getUsers', Controller.getUsers)
router.post('/getUserInfo', Controller.getUserInfo)
router.post('/updateUser', Controller.updateUser)
router.post('/deleteUser', Controller.deleteUser)

module.exports = router;