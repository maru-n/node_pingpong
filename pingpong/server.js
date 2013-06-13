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
        res.end(data);
    });
};

io.sockets.num=0;
io.sockets.on('connection', function (socket) {
    if(++io.sockets.num>2)
        //TODO:複数プレイは後で対応
        return;

    var t=1;
    setInterval(function() {
        var theta=++t/180*Math.PI; 
        console.log(theta);
        socket.send({ballX:Math.cos(theta),ballY:Math.sin(theta)});
    }, 100);


    socket.on('message', function (data) {
        var msg = "[" + socket.id + "] >> " + data;
        socket.send(msg);
        socket.broadcast.send(msg);
    });
});
