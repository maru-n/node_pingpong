exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
};


var MaxPlayers = 4;

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
        var p = new Player();
        socket.on('pos', function (data) {
            console.log(data);
        });
        p.setSocket(socket);
        p.setName(name);
        this.players.push(p);

        this.setupGame();
        if(!this.isWaitingGame()){
            this.startGame();
        }
    },

    setupGame: function() {
        var data ={};
        this.sendData2AllPlayers('setup', data);
    },
    
    startGame: function() {
        var data ={};
        this.sendData2AllPlayers('start_game', data);
        this.playGame();
    },

    endGame: function() {
        var data ={};
        this.sendData2AllPlayers('end_game', data);
    },

    playGame: function() {
        var data = {};
        this.sendData2AllPlayers('play', data);
        var self = this;
        this.updateTimer = setInterval(function(){
            self.update();
        }, 30);
    },

    pauseGame: function() {
        clearInterval(this.updateTimer);
        var data = {};
        this.sendData2AllPlayers('pause', data);
        //TODO:
        //ゲーム終了？
        if( false ) {
            this.endGame();
        }else{
            this.play();
        }
    },

    update: function() {
        //TODO:
        //update logic of games
        var data ={};
        this.sendData2AllPlayers('update', data);
    },

    getPlayerNum : function() {
        return this.players.length;
    },

    sendData2AllPlayers : function(msgName, data) {
        for(var i=0; i<this.getPlayerNum(); i++) {
            this.players[i].socket.emit(msgName, data);
        }
    },

    isWaitingGame: function() {
        if( this.getPlayerNum() != MaxPlayers ){
            return false;
        }else{
            return true;
        }
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



