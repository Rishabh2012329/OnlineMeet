const socket = io('/')
//check for user
const peer = new Peer(undefined,{
    host:'onlinemeet12.herokuapp.com',
    path:"/peerjs"
})


let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted=true

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    
    myVideoStream=stream
    document.getElementById('audio').onclick=muteUnmute
    document.getElementById('video').onclick=playStop
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
        if(userId!==peer.id)
            setTimeout(ConnectToAnotherUser,3000,userId,stream);
        
    })
    peer.on('error',err=>{
        console.log(err)
    })
}).catch(err=>{
    console.log(err) 
})

peer.on('open',(id)=>{
    console.log(id)
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
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      console.log("muted")
      setStopAudio();
    } else {
      setPlayAudio();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }

// disable video
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setStopVideo()
    } else {
      setPlayVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

// chat update

//video stream
function addVideoStream(video,stream){
    video.srcObject=stream
    const div = document.createElement('div')
    div.classList.add('videoOuter')
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    div.appendChild(video)
    document.getElementById('video-grid').appendChild(div)
}


const setPlayVideo=()=>{
    document.getElementById('video').classList.remove('fa-video-slash')
    document.getElementById('video').classList.add('fa-video')
}
const setStopVideo=()=>{
    document.getElementById('video').classList.remove('fa-video')
    document.getElementById('video').classList.add('fa-video-slash')
}

const setPlayAudio=()=>{
    document.getElementById('audio').classList.remove('fa-microphone-slash')
    document.getElementById('audio').classList.add('fa-microphone')
}
const setStopAudio=()=>{
    document.getElementById('audio').classList.remove('fa-microphone')
    document.getElementById('audio').classList.add('fa-microphone-slash')
}