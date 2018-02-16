const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

app.use(express.static('client'));

const sockets = [];
// const orb = {};
let test = false;

io.on('connection', (socket) => {
  const s = socket;
  // console.log('Someone connected!');
  s.id = Math.random();
  s.x = Math.floor(500 * Math.random());
  s.y = Math.floor(500 * Math.random());
  s.up = false;
  s.down = false;
  s.left = false;
  s.right = false;
  s.xVelocity = 0;
  s.yVelocity = 0;

  sockets.push(s);

  s.on('movement', (data) => {
    const keydown = data[0];
    const keycode = data[1];
    // console.log(keydown, keycode);

    if (keycode === 81) { // q
      test = keydown;
    }

    if (keycode === 38 || keycode === 87) {
      s.up = keydown;
    } else if (keycode === 40 || keycode === 83) {
      s.down = keydown;
    } else if (keycode === 37 || keycode === 65) {
      s.left = keydown;
    } else if (keycode === 39 || keycode === 68) {
      s.right = keydown;
    }

    if (s.up && !s.down) {
      s.yVelocity = -10;
    } else if (!socket.up && socket.down) {
      s.yVelocity = 10;
    } else {
      s.yVelocity = 0;
    }

    if (s.right && !s.left) {
      s.xVelocity = 10;
    } else if (!socket.right && socket.left) {
      s.xVelocity = -10;
    } else {
      s.xVelocity = 0;
    }
  });
});

setInterval(() => {
  const positions = [];
  for (let i = 0; i < sockets.length; i += 1) {
    const s = sockets[i];
    s.x += s.xVelocity;
    s.y += s.yVelocity;
    if (test) {
      s.x += (Math.random() * 10) - 5;
      s.y += (Math.random() * 10) - 5;
    }

    positions.push({
      x: s.x,
      y: s.y,
    });
  }
  io.sockets.emit('all_movements', positions);
}, 1000 / 30);

server.listen(2000);
