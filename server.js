var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('client'));

var sockets = []
var test = false;

io.on('connection', function(socket) {
    console.log('Someone connected!');
    socket.id = Math.random();
    socket.x = Math.floor(500 * Math.random());
    socket.y = Math.floor(500 * Math.random());
    socket.up = false;
    socket.down = false;
    socket.left = false;
    socket.right = false;
    socket.xVelocity = 0;
    socket.yVelocity = 0;

    sockets.push(socket);

    socket.on('movement', function(data) {
        var keydown = data[0];
        var keycode = data[1];
        console.log(keydown, keycode);

        if (keycode == 81) {
            test = keydown;
        }

        if (keycode == 38 || keycode == 87) {
            socket.up = keydown;
        } else if (keycode == 40 || keycode == 83) {
            socket.down = keydown;
        } else if (keycode == 37 || keycode == 65) {
            socket.left = keydown;
        } else if (keycode == 39 || keycode == 68) {
            socket.right = keydown;
        }

        if (socket.up && !socket.down) {
            socket.yVelocity = -10;
        } else if (!socket.up && socket.down) {
            socket.yVelocity = 10;
        } else {
            socket.yVelocity = 0;
        }

        if (socket.right && !socket.left) {
            socket.xVelocity = 10;
        } else if (!socket.right && socket.left) {
            socket.xVelocity = -10;
        } else {
            socket.xVelocity = 0;
        }

    });
});

setInterval(function() {
    positions = []
    for (var i = 0; i < sockets.length; i++) {
        var s = sockets[i];
        s.x += s.xVelocity;
        s.y += s.yVelocity;
        if (test) {
            s.x += (Math.random() * 10) - 5;
            s.y += (Math.random() * 10) - 5;
        }

        positions.push({
            x: s.x,
            y: s.y
        });
    }
    io.sockets.emit('all_movements', positions);
}, 1000/30);

server.listen(2000);
