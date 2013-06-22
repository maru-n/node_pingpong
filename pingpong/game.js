exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
};

var Game = function() {
    this.players = new Array();
    this.playTime = 0;
};
Game.prototype = {
    addPlayer : function(socket, name) {
        if(this.getPlayerNum() >= 2) {
            return false;
        }
        var p = new Player();
        socket.on('pos', function (data) {
            p.x = data.cursolX;
        });

        p.setSocket(socket);
        p.setName(name);
        p.x = 0.7;
        this.players.push(p);

        if( this.players.length == 2 ) {
            this.start();
        };
        
        return true;
    },
    
    start: function() {
        var self = this;
        setInterval(function(){
            self.update();
        }, 30);
    },

    update: function() {
        var theta = (this.playTime+=20)/180*Math.PI,
            r = 0.3;
        var play0_data={
            ballX:r*Math.cos(theta)+0.5,
            ballY:r*Math.sin(theta)+0.5,
            myX:this.players[0].x,
            otherX:this.players[1].x
        };
        this.players[0].socket.emit('update', play0_data);
        var play1_data={
            ballX:r*Math.cos(theta)+0.5,
            ballY:r*Math.sin(theta)+0.5,
            myX:this.players[1].x,
            otherX:this.players[0].x
        };
        this.players[1].socket.emit('update', play1_data);
    },

    getPlayerNum : function() {
        return this.players.length;
    }
};

var Player = function() {
    this.name = "anonimous";
    this.socket = null;
    this.x = 0.5;
};
Player.prototype = {
    setSocket: function(socket) {
        this.socket = socket;
    },
    setName: function(name) {
        this.name = name;
    }
};

function test() {
    var g = exports.getNewGame();
    var p = new Player();
    p.setName("player1");
    console.log(p.name);
};


//test();
