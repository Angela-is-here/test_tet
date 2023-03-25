class WebRTC {
    constructor(room) {
      this.room = room;
      this.pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.stunprotocol.org' },
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });
      this.localStream = null;
      this.remoteStreams = {};
      this.pc.onicecandidate = event => {
        if (event.candidate) {
          this.sendMessage({ candidate: event.candidate });
        }
      };
      this.pc.ontrack = event => {
        const stream = event.streams[0];
        const id = stream.id;
        if (!(id in this.remoteStreams)) {
          this.remoteStreams[id] = stream;
          this.createVideoElement(id);
        }
        const video = this.getVideoElement(id);
        video.srcObject = stream;
      };
    }
  
    async startLocalVideo() {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      const video = document.getElementById('local-video');
      video.srcObject = this.localStream;
      const track = this.localStream.getTracks()[0];
      this.pc.addTrack(track, this.localStream);
    }
  
    start() {
      this.pc.createOffer().then(offer => {
        return this.pc.setLocalDescription(offer);
      }).then(() => {
        this.sendMessage({ offer: this.pc.localDescription });
      });
    }
  
    receiveMessage(message) {
      if ('offer' in message) {
        const offer = new RTCSessionDescription(message.offer);
        this.pc.setRemoteDescription(offer).then(() => {
          return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
          });
        }).then(stream => {
          const track = stream.getTracks()[0];
          this.localStream.addTrack(track);
          this.pc.addTrack(track, this.localStream);
            return this.pc.createAnswer();
          }).then(answer => {
            return this.pc.setLocalDescription(answer);
          }).then(() => {
            this.sendMessage({ answer: this.pc.localDescription });
          });
        } else if ('answer' in message) {
          const answer = new RTCSessionDescription(message.answer);
          this.pc.setRemoteDescription(answer);
        } else if ('candidate' in message) {
          const candidate = new RTCIceCandidate(message.candidate);
          this.pc.addIceCandidate(candidate);
        }
        }
        
        sendMessage(data) {
        const message = {
        room: this.room,
        data: data,
        };  
        const url = 'http://hk3666.itp.io/testIndex.html';
    fetch(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(message)
});
}

createVideoElement(id) {
const div = document.createElement('div');
//,
div.setAttribute('id', 'remote-video-container-${id}');
div.innerHTML = `<video id="remote-video-${id}" autoplay playsinline></video>`;
const remoteVideos = document.getElementById('remote-videos');
remoteVideos.appendChild(div);
}

getVideoElement(id) {
    const video = document.getElementById(`remote-video-${id}`);
// ,
return video;
}
}