var express = require('express');
var router = express.Router();
const {register, login, userProfile, checkLogin,logout} = require('../controllers/user')
const {verifyToken} = require('../Middlewares/auth')

router.post('/register',register)
router.post('/login',login)

router.get('/logout',verifyToken,logout)
router.get('/checkLogin',verifyToken,checkLogin)
router.get('/userProfile/:id',verifyToken,userProfile)

module.exports = router