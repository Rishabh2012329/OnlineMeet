var express = require('express');
var router = express.Router();
const {addMembers, createRoom, deleteRoom, notifyMembers,  getRooms, createRoomExternal, addMembersExternal} = require('../controllers/room')
const {verifyToken} = require('../Middlewares/auth')

router.post('/addMembers',verifyToken,addMembers)
router.post('/addMembersExternal',addMembersExternal)
router.post('/createRoomExternal',createRoomExternal)
router.post('/createRoom',verifyToken,createRoom)

router.get('/getRooms',verifyToken,getRooms)
router.get('/notifyMembers',verifyToken,notifyMembers)

router.delete('/deleteRoom/:id',verifyToken,deleteRoom)

module.exports = router