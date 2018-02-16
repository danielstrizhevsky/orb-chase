const socket = io();
const audio = new Audio('test.mp3');

const ctx = document.getElementById('mCanvas').getContext('2d');

document.onkeydown = (e) => {
  socket.emit('movement', [true, e.keyCode]);
};

document.onkeyup = (e) => {
  socket.emit('movement', [false, e.keyCode]);
  audio.pause();
};

socket.on('play', () => {
  audio.play();
});

socket.on('pause', () => {
  audio.pause();
});

socket.on('all_movements', (positions, orb) => {
  ctx.clearRect(0, 0, 500, 500);
  for (let i = 0; i < positions.length; i += 1) {
    ctx.fillRect(positions[i].x, positions[i].y, 10, 10);
  }
  ctx.beginPath();
  ctx.arc(orb.x, orb.y, 10, 0, Math.PI * 2);
  ctx.stroke();
});
