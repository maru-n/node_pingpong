exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
};

var Game = function() {
    this.players = new Array();
    this.ball = {
        x:0.5,
        y:0.5,
        vx:0,
        vy:0
    };
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
        this.players.push(p);

        if( this.players.length == 2 ) {
            this.start();
        };
        
        return true;
    },
    
    start: function() {
        var iv = 0.01;
        var t = Math.random() * Math.PI * 2.0;
        this.ball.vx = iv * Math.cos(t);
        this.ball.vy = iv * Math.sin(t);
        var self = this;
        setInterval(function(){
            self.update();
        }, 30);
    },

    update: function() {
        var play0_data={
            ballX:this.ball.x,
            ballY:this.ball.y,
            myX:this.players[0].x,
            otherX:this.players[1].x
        };
        this.players[0].socket.emit('update', play0_data);
        var play1_data={
            ballX:this.ball.x,
            ballY:this.ball.y,
            myX:this.players[1].x,
            otherX:this.players[0].x
        };
        this.players[1].socket.emit('update', play1_data);
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        if(this.ball.x < 0) {
            this.ball.x = 0;
            this.ball.vx *= -1;
        }else if(this.ball.x > 1.0) {
            this.ball.x = 1.0;
            this.ball.vx *= -1;
        }
        if(this.ball.y < 0) {
            this.ball.y = 0;
            this.ball.vy *= -1;
        }else if(this.ball.y > 1.0) {
            this.ball.y = 1.0;
            this.ball.vy *= -1;
        }
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

