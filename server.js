const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4:uuidv4} = require('uuid')
const {ExpressPeerServer} = require('peer')
const peerServrer = ExpressPeerServer(server,{debug:true})
const dotenv = require('dotenv')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL||"",()=>{
    console.log('connected to database')
})

dotenv.config()

app.set('view engine','ejs')

app.use(express.static('public'))

app.use('/peerjs',peerServrer)

app.get('/',(req,res)=>{
    res.redirect('/'+uuidv4())
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room,PORT:process.env.PORT||3000})
})

io.on('connection',(socket)=>{
    socket.on('join-room',async(roomId,userId)=>{  
        await socket.join(roomId)
       io.to(roomId).emit('user-connected',userId)
    })
    socket.on('messages',(message,userId,roomId)=>{
        io.to(roomId).emit('messageServer',message,userId)
    })
})

app.use((req,res,next)=>{
    const errors = {
        'BAD':"BAD Request"
    }
    const error = new Error(req.errors['BAD'])
    error.status(400)
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status||500)
    res.json({
        error:{
            message:error.message
        }
    })
})

server.listen(process.env.PORT||3000)

