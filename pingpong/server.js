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
        return res.end(data);
    });
};

var waitingGame = null;

io.sockets.on('connection', function (socket) {
    if( !waitingGame ) {
        var newGame = require('game').getNewGame();
        waitingGame = newGame;
    }
    waitingGame.addPlayer(socket, "player0");
    if(!waitingGame.isWaitingGame()){
        waitingGame = null;
    }
});

