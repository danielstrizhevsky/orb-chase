const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

app.use(express.static('client'));

const sockets = {};
const orb = {
  x: 250, y: 250, xVelocity: 0, yVelocity: 0,
};
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

  sockets[s.id] = s;

  s.on('disconnect', () => {
    delete sockets[s.id];
  });

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
  let touching = false;
  Object.keys(sockets).forEach((key) => {
    const s = sockets[key];
    s.x += s.xVelocity;
    s.y += s.yVelocity;
    if (test) {
      s.x += (Math.random() * 10) - 5;
      s.y += (Math.random() * 10) - 5;
    }
    if (Math.sqrt((((s.x + 5) - orb.x) ** 2) + (((s.y + 5) - orb.y) ** 2)) < 15) {
      touching = true;
    }
    positions.push({
      x: s.x,
      y: s.y,
    });
  });
  if (Math.random() < 0.05) {
    orb.xVelocity = (Math.random() * 10) - 5;
  }
  if (Math.random() < 0.05) {
    orb.yVelocity = (Math.random() * 10) - 5;
  }
  orb.x += orb.xVelocity;
  orb.y += orb.yVelocity;
  if ((orb.x > 500 && orb.xVelocity > 0) || (orb.x < 0 && orb.xVelocity < 0)) {
    orb.xVelocity = -orb.xVelocity;
  }
  if ((orb.y > 500 && orb.yVelocity > 0) || (orb.y < 0 && orb.yVelocity < 0)) {
    orb.yVelocity = -orb.yVelocity;
  }
  if (touching) {
    io.sockets.emit('play');
  } else {
    io.sockets.emit('pause');
  }
  io.sockets.emit('all_movements', positions, orb);
}, 1000 / 30);

server.listen(2000);
