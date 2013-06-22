var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(3001);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        
        res.writeHead(200);
        return res.end(data);
    });
};

io.sockets.on('connection', function (socket) {

    setInterval(function() {
        socket.send("[server] >> おーーーーい。");
    }, 5000);


    socket.on('message', function (data) {
        var msg = "[" + socket.id + "] >> " + data;
        socket.send(msg);
        socket.broadcast.send(msg);
    });
});

