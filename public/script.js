const socket = io('/')
//check for user
const peer = new Peer(undefined,{
    host:'online-meet-69.herokuapp.com',
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
        call.on('drone',droneStream=>{
            addVideoStream(video,droneStream)
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



function callbackFunc(response) {
    // do something with the response
    console.log(response);
}

peer.on('open',(id)=>{
    console.log(id)
    socket.emit('join-room',ROOM_ID,id)
})

//chats display toggle
function toggleChat(){
    const chatBox = document.getElementById("chatBox")
    if(chatBox.style.animationName==="goneMessage"||chatBox.style.animationName===""){
        chatBox.style.animationName="enterMessage"
        chatBox.style.animationDuration="0.8s"
        chatBox.style.transform="translateX(0)"
    }else{
        chatBox.style.animationName="goneMessage"
        chatBox.style.animationDuration="0.8s"
        chatBox.style.transform="translateX(250px)"
    }
}
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
function sendMessage(){
    const input = document.getElementById('chatInput')
    socket.emit("messages",input.value,peer.id,ROOM_ID)
    input.value=""
}
socket.on('messageServer',(message,uid)=>{
    const div = document.createElement('div')
    div.innerHTML=message
    const outer = document.createElement('div')
    const user = document.createElement('div')
    user.innerText=uid
    outer.classList.add('message-wrapper')
    user.classList.add('user-name')
    div.classList.add('message')
    outer.appendChild(user)
    outer.appendChild(div)
    document.getElementById('userMessages').appendChild(outer)
})
//video stream
function addVideoStream(video,stream){
    video.srcObject=stream
    const div = document.createElement('div')
    div.classList.add('videoOuter')
    const overlay = document.createElement('div')
    overlay.classList.add('overlay')
    
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    div.appendChild(video)
    div.appendChild(overlay)
    document.getElementById('video-grid').appendChild(div)
}
var displayMediaOptions = {
    video: {
      cursor: "always"
    },
    audio: false
  };
//presentScreen
async function present(){
    let doc = document.getElementById('presenting')
    if(doc){
        document.getElementById('present').style.color="white"
        doc.remove()
        return
    }
    const video = document.createElement('video')
    video.id="presenting"
    video.autoplay=true
    const captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    console.log(captureStream)
    video.srcObject=captureStream
    video.style.height="85vh"
    video.style.maxHeight="85vh"
    video.style.width="70vw"
    document.getElementById('present').style.color="red"
    document.getElementById('present_area').appendChild(video)
}

//Video Playing and Stoping Options

const setPlayVideo=()=>{
    document.getElementById('video').classList.remove('fa-video-slash')
    document.getElementById('video').classList.add('fa-video')
}
const setStopVideo=()=>{
    document.getElementById('video').classList.remove('fa-video')
    document.getElementById('video').classList.add('fa-video-slash')
}

// Audio Playing and Stoping Options

const setPlayAudio=()=>{
    document.getElementById('audio').classList.remove('fa-microphone-slash')
    document.getElementById('audio').classList.add('fa-microphone')
}
const setStopAudio=()=>{
    document.getElementById('audio').classList.remove('fa-microphone')
    document.getElementById('audio').classList.add('fa-microphone-slash')
}