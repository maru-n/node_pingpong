exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
};


const MAX_PLAYER_NUM = 2;

var Game = function() {
    this.id = Math.floor(Math.random() * 1000);
    this.players = new Array();
    this.field = new Field();
};

Game.prototype = {
    addPlayer : function(socket, name) {
        var p = new Player(this.players.length);
        socket.on('pos', function (data) {
            console.log(data);
        });
        p.setSocket(socket);
        p.setName(name);
        this.players.push(p);

        this.setup();
        if(!this.isWaitingGame()){
            this.start();
        }
    },

    setup: function() {
        for(var i=0; i<this.getPlayerNum(); i++) {
            var data = {
                "gameData": this.getJson(),
                "playerData": this.getPlayerDataArray(),
                "yourId": this.players[i].id
            };
            this.players[i].socket.emit("setup", data);
        }
    },
    
    start: function() {
        var data ={};
        this.sendData2AllPlayers('start', data);
        this.play();
    },

    end: function() {
        var data ={};
        this.sendData2AllPlayers('end', data);
    },

    play: function() {
        var data = {
            "gameData": this.getJson(),
            "fieldData": this.field.getJson(),
            "playerData": this.getPlayerDataArray(),
            "playerData": this.getPlayerDataArray()
        };
        this.sendData2AllPlayers('play', data);
        //this.startUpdate();
    },

    pause: function() {
        //this.stopUpdate();
        var data = {};
        this.sendData2AllPlayers('pause', data);
        //TODO:
        //ゲーム終了？
        if( false ) {
            this.end();
        }else{
            this.play();
        }
    },

    startUpdate: function() {
        var self = this;
        this.updateTimer = setInterval(function(){
            self.update();
        }, 30);
    },

    stopUpdate: function() {
        clearInterval(this.updateTimer);
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
        if( this.getPlayerNum() < MAX_PLAYER_NUM ){
            return true;
        }else{
            return false;
        }
    },

    getJson: function() {
        var json = {
            "id": this.id
        };
        return json;
    },

    getPlayerDataArray: function() {
        var playerData = new Array();
        for(var i=0; i<this.getPlayerNum(); i++) {
            playerData.push(this.players[i].getJson());
        }
        return playerData;
    }
};

var Field = function() {
    this.ballX = 0.0;
    this.ballY = 0.0;
}
Field.prototype = {
    getJson: function() {
        var json = {
            "ballX": this.ballX,
            "ballY": this.ballY
        };
        return json;
    }
};

var Player = function(id) {
    this.id = id;
    this.name = "anonimous";
    this.socket = null;
    this.angle = (id * 2.0*Math.PI / MAX_PLAYER_NUM) + Math.PI/2.0;
    this.width = 0.2;
    var color_h = this.id * 1.0/MAX_PLAYER_NUM;
    var r=0, g=0, b=0;
    if( color_h < 1.0/6.0 ){
        r = 255;
        g = color_h * 6.0 * 255;
        b = 0;
    }else if( color_h < 2.0/6.0 ){
        r = 255 - (color_h * 6.0 - 1.0) * 255;
        g = 255;
        b = 0;
    }else if( color_h < 3.0/6.0 ){
        r = 0;
        g = 255;
        b = (color_h * 6.0 - 2.0) * 255;
    }else if( color_h < 4.0/6.0 ){
        r = 0;
        g = 255 - (color_h * 6.0 - 3.0) * 255;
        b = 255;
    }else if( color_h < 5.0/6.0 ){
        r = (color_h * 6.0 - 4.0) * 255;
        g = 0;
        b = 255;
    }else{
        r = 255;
        g = 0;
        b = 255 - (color_h * 6.0 - 5.0) * 255;
    }
    this.color = "#" + 
        ("0" + r.toString(16)).slice(-2) + 
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
    this.score = 0;
};
Player.prototype = {
    setSocket: function(socket) {
        this.socket = socket;
    },
    setName: function(name) {
        this.name = name;
    },
    setId: function(id) {
        this.id = id;
    },
    getJson: function() {
        var json = {
            "id": this.id,
            "name": this.name,
            "angle": this.angle,
            "width": this.width,
            "color": this.color,
            "score": this.score
        };
        return json;
    }
};

function test() {
    var g = exports.getNewGame();
    var p = new Player();
    p.setName("player1");
    console.log(p.name);
    
};


//test();



