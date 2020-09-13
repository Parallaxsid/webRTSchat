
const socket = io();
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer (undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'

})

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
  })
  

})


peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);

})

const connectToNewUser = (userId, stream) => {
 const call = peer.call(userId, stream)
 const video = document.createElement('video')
 call.on('stream', userVideoStream => {
   addVideoStream(video, userVideoStream)
 })

}

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}


const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}


const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}



const message = document.getElementById('message'),
handle = document.getElementById('handle'),
output = document.getElementById('output'),
typing = document.getElementById('typing'),
button = document.getElementById('button');


message.addEventListener('keypress', () => {
  socket.emit('userTyping',handle.value)
   })
   


button.addEventListener('click', () => {
    socket.emit('userMessage', {
                handle: handle.value,
                message: message.value

    })
    document.getElementById('message').value="";
})

socket.on("userMessage", (data) => {
    typing.innerHTML="";
    output.innerHTML += '<p> <strong>' + data.handle + ' </strong>' + data.message + '</p>'
})


socket.on('userTyping', (data) => {
    typing.innerHTML = '<p><em>' + data + ' is typing... </em></p>'
})

$(document).keypress(function (e) {
  if (e.which == 13) {
          document.getElementById("button").click();
          document.getElementById("text");
          
  }
});




