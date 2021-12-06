var express = require('express');
var router = express.Router();
const {} = require('../controllers/meeting')
const {verifyToken} = require('../Middlewares/auth')


router.post('/sheduleMeeting',verifyToken,sheduleMeeting)




module.exports = router