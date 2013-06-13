var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(3001);

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
io.sockets.on('connection', function (socket) {
    socket.num=io.sockets.num;
    if(++io.sockets.num>2)
        //TODO:複数プレイは後で対応
        return;

    var players=[0,0];
    var t=1;
    setInterval(function() {
        var theta=++t/180*Math.PI,
            data={
                ballX:Math.cos(theta),
                ballY:Math.sin(theta),
                myX:players[socket.num],
                otherX:players[socket.num==0?1:0]
            };
            console.log(socket.num+':'+players[socket.num]);
        socket.emit('update',data);
    }, 100);


    socket.on('pos', function (data) {
        // console.log(data);
        players[socket.num]=data.cursolX;
        // var msg = "[" + socket.id + "] >> " + data;
        // socket.send(msg);
        // socket.broadcast.send(msg);
    });
});

