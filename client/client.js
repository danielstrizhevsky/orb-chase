const socket = io();

const ctx = document.getElementById('mCanvas').getContext('2d');

document.onkeydown = (e) => {
  socket.emit('movement', [true, e.keyCode]);
};

document.onkeyup = (e) => {
  socket.emit('movement', [false, e.keyCode]);
};

socket.on('all_movements', (positions) => {
  ctx.clearRect(0, 0, 500, 500);
  for (let i = 0; i < positions.length; i += 1) {
    ctx.fillRect(positions[i].x, positions[i].y, 10, 10);
  }
});
