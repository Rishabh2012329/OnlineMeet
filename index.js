const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4:uuidv4} = require('uuid')
const {ExpressPeerServer} = require('peer')
const peerServrer = ExpressPeerServer(server,{debug:true})
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRoute = require('./Routes/user')
const Room = require('./models/Rooms')
const User = require('./models/Users')
const { verifyTokenExternal, verifyToken } = require('./Middlewares/auth')
const cookieParser = require('cookie-parser')
const roomRoute = require('./Routes/room')
const path = require('path')
var ObjectId = require('mongoose').Types.ObjectId;

dotenv.config()

mongoose.connect(process.env.MONGO_URL||"",(error,res)=>{
    console.log('connected to database')
})



app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use('/peerjs',peerServrer)


app.use('/user',userRoute)
app.use('/room',roomRoute)

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/:room',verifyToken,async (req,res,next)=>{
    if(!req.body.userId){
        req.error = "NOT_LOGGED"
        return next()
    }
    if(!ObjectId.isValid(req.params.room)){
        req.error = "NOT_FOUND"
        return next()
    }
    const room = await Room.findOne({_id:req.params.room})
    if(!room){
        req.error = "NOT_FOUND"
        return next()
    }
    const usr = await User.findOne({_id:req.body.userId})

    if(usr._id!==room.uid&&(!room.email.includes(usr?.email)||!usr)){
        req.error = "NOT_LOGGED"
        return next()
    }
    res.render('room',{roomId:req.params.room,PORT:process.env.PORT||3000})
})

app.get('/external/:room',verifyTokenExternal,async (req,res)=>{
    const {email} = req.user
    let roomId = req.params.room
    const room = await Room.findOne({_id:roomId})
    if(room.members.includes(email))
        res.render('room',{roomId:req.params.room,PORT:process.env.PORT||3000})
})

io.on('connection',(socket)=>{ 
    //Joining Room
    socket.on('join-room',async(roomId,userId)=>{  
        await socket.join(roomId)
       io.to(roomId).emit('user-connected',userId)
    })
    //Chats
    socket.on('messages',(message,userId,roomId)=>{
        io.to(roomId).emit('messageServer',message,userId)
    })
})

app.use((req,res,next)=>{
    const errors = {
        'BAD':"Bad Request",
        "USER_AUTH":"Email and Password are required!",
        "INVALID":"Invalid Credentials!",
        "NOT_FOUND":"Not Found!",
        "DEFAULT":"Something Went Wrong",
        "NOT_LOGGED":"Plz login"
    }
    const error = new Error(errors[req.error])
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(500)
    res.json({
        error:{
            message:error.message
        }
    })
})

server.listen(process.env.PORT||5050)

