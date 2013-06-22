var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(3000);

function handler (req, res) {
    var path = req.url;
    if(path === "/") {
        path += "index.html";
    }
     fs.readFile(__dirname + path,function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
};

io.sockets.num=0;
io.sockets.players=[0,0];
io.sockets.on('connection', function (socket) {
    socket.num=io.sockets.num;
    if(++io.sockets.num>2)
        //TODO:複数プレイは後で対応
        return;

    var t=1;
    setInterval(function() {
        var theta=(t+=20)/180*Math.PI,
            r=0.3;
            play_data={
                ballX:r*Math.cos(theta)+0.5,
                ballY:r*Math.sin(theta)+0.5,
                myX:io.sockets.players[socket.num],
                otherX:io.sockets.players[socket.num==0?1:0]
            };
        socket.emit('update',play_data);
    }, 30);


    socket.on('pos', function (data) {
        io.sockets.players[socket.num]=data.cursolX;
    });
});



