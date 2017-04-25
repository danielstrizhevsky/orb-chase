var socket = io();

var ctx = document.getElementById('mCanvas').getContext('2d');

document.onkeydown = function(e) {
    socket.emit('movement', [true, e.keyCode]);
}

document.onkeyup = function(e) {
    socket.emit('movement', [false, e.keyCode]);
}

socket.on('all_movements', function(positions) {
    ctx.clearRect(0, 0, 500, 500);
    for (var i = 0; i < positions.length; i++) {
        ctx.fillRect(positions[i].x, positions[i].y, 10, 10);
    }
});
