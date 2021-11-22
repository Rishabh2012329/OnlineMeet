var express = require('express');
var router = express.Router();
const {register,login} = require('../controllers/user')

router.post('/register',register)
router.post('/login',login)
router.post('/createRoom')
router.post('/notifyMembers')

router.get('/userProfile')

module.exports = router