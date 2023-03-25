let webRTC;
let myId;
let myRect;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  fill(255, 0, 0);
  webRTC = new WebRTC('my-room');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // the browser supports getUserMedia
    webRTC.startLocalVideo();
  } else {
    // the browser does not support getUserMedia
    console.log('getUserMedia is not supported in this browser');
  }
  webRTC.startLocalVideo();
  webRTC.onMessage = onMessage;
webRTC.onConnect = onConnect;
webRTC.onDisconnect = onDisconnect;
}

function draw() {
  background(0);
  if (myId && myRect) {
    const x = myRect.x;
    const y = myRect.y;
    webRTC.sendMessage({ id: myId, x: x, y: y });
  }
}

function mousePressed() {
  if (myRect && myRect.contains(mouseX, mouseY)) {
    myRect.dragging = true;
  }
}

function mouseReleased() {
  if (myRect) {
    myRect.dragging = false;
  }
}

function mouseDragged() {
  if (myRect && myRect.dragging) {
    myRect.x = mouseX;
    myRect.y = mouseY;
  }
}

function onMessage(message) {
  if ('id' in message && 'x' in message && 'y' in message) {
    const id = message.id;
    const x = message.x;
    const y = message.y;
    const video = webRTC.getVideoElement(id);
    if (video) {
      const rect = video.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const scaleX = width / 100;
      const scaleY = height / 100;
      const rectX = x * scaleX;
      const rectY = y * scaleY;
      video.style.transform = `translate(${rectX}px, ${rectY}px)`;
    }
  }
}

function onConnect(id) {
  myId = id;
  myRect = {
    x: width / 2 - 50,
    y: height / 2 - 50,
    width: 100,
    height: 100,
    dragging: false,
    contains: function(x, y) {
      return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    },
  };
}

function onDisconnect(id) {
  const videoContainer = document.getElementById(`remote-video-container-${id}`);
  if (videoContainer) {
    videoContainer.remove}
}
