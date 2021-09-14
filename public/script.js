const socket = io('/')
//check for user
const peer = new Peer(undefined,{
    host:'https://onlinemeet12.herokuapp.com',
    port:""+PORT,
    path:"peerjs"
})



const myVideo = document.createElement('video')
myVideo.muted=true

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    
    
    // provide our stream
    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement("video")
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })
    addVideoStream(myVideo,stream)
    socket.on('user-connected',(userId)=>{
        console.log(userId)
        setTimeout(ConnectToAnotherUser,3000,userId,stream);
        
    })
    peer.on('error',err=>{
        console.log(err)
    })
}).catch(err=>{
    console.log(err) 
})

peer.on('open',(id)=>{
    socket.emit('join-room',ROOM_ID,id)
})



// add other uservideos to ours
function ConnectToAnotherUser(userId,stream){
    const call = peer.call(userId,stream)
    const video = document.createElement("video")
    call.on('stream',userVideoStream=>{
        console.log("streamUser ",userVideoStream)
        addVideoStream(video,userVideoStream)
    })
    
    call.on('error',(error)=>{
        console.log(error);
    })
    peer.on('error', function(err) {
        console.log(err);
    });
}

// remove video when a user leaves

// send video and audio

// mute audio 

// disable video

// chat update

//video stream
function addVideoStream(video,stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    document.getElementById('video-grid').appendChild(video)
}


