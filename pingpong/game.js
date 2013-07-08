exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
};


const MAX_PLAYER_NUM = 3;
const DELTA_THETA = 0.05;
const UPDATE_INTERVAL_MSEC = 20;

var Game = function() {
    this.id = Math.floor(Math.random() * 1000);
    this.players = new Array();
    this.field = new Field();
};

Game.prototype = {
    addPlayer : function(socket, name) {
        var p = new Player(this.players.length);
        socket.on('action', function (data) {
            switch (data.keydown) {
            case 37: //left
                p.moving = "left";
                break;
            case 39: //right
                p.moving = "right";
                break;
            }
            switch (data.keyup) {
            case 37: //left
                if( p.moving==="left" ) {
                    p.moving = null;
                }
                break;
            case 39: //right
                if( p.moving==="right" ) {
                    p.moving = null;
                }
                break;
            }
        });
        p.setSocket(socket);
        p.setName(name);
        this.players.push(p);
        this.field.setPlayers(p);
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
            "playerData": this.getPlayerDataArray()
        };
        this.sendData2AllPlayers('play', data);
        this.startUpdate();
    },

    pause: function() {
        //this.stopUpdate();
        var data = {};
        this.sendData2AllPlayers('pause', data);

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
        }, UPDATE_INTERVAL_MSEC);
    },

    stopUpdate: function() {
        clearInterval(this.updateTimer);
    },


    update: function() {
        this.field.update();
        if( this.field.isBallOut() ) {
            this.field.initPosition();
        }
        var data ={
            "fieldData": this.field.getJson(),
            "playerData": this.getPlayerDataArray()
        };
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

const INITIAL_VEL = 0.01;
const FIELD_RADIUS = 1.0;

var Field = function() {
    this.initPosition();
    this.players = new Array();
};
Field.prototype = {
    setPlayers: function(p) {

        this.players.push(p);
    },
    initPosition: function() {
        this.ballX = 0.0;
        this.ballY = 0.0;
        var a = Math.random() * Math.PI * 2.0;
        this.ballVX = INITIAL_VEL * Math.cos(a);
        this.ballVY = INITIAL_VEL * Math.sin(a);
        this.ballOut = false;
    },
    update: function() {
        //action of players
        for(var i=0; i<this.players.length; i++) {
            this.players[i].updatePosition();
        }

        //update ball position
        this.ballX += this.ballVX;
        this.ballY += this.ballVY;

        //refrection
        if(  Math.sqrt(Math.pow(this.ballX,2) + Math.pow(this.ballY,2)) >= FIELD_RADIUS ) {
            var ballAngle = Math.atan2(this.ballY, this.ballX);
            for(i=0; i<this.players.length; i++) {
                var p = this.players[i];
                var pAng = (p.angle >= Math.PI) ? p.angle-Math.PI*2.0 : p.angle;
                var pAng1 = pAng - p.width/2/FIELD_RADIUS;
                var pAng2 = pAng + p.width/2/FIELD_RADIUS;
                if( pAng1 < ballAngle && pAng2 > ballAngle) {
                    this.ballVX *= -1;
                    this.ballVY *= -1;
                    break;
                }
                if( i == this.players.length-1 ) {
                    this.ballOut = true;
                }
            }
        }
    },
    isBallOut: function() {
        return this.ballOut;
    },

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
    this.moving = null; //"left" or "right" or null
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
    },
    updatePosition: function() {
        if( this.moving === "left" ) {
            this.angle += DELTA_THETA;
            if( this.angle > Math.PI * 2.0 ) {
                this.angle -= Math.PI * 2.0;
            }
        }else if( this.moving === "right" ) {
            this.angle -= DELTA_THETA;
            if( this.angle < 0.0 ) {
                this.angle += Math.PI * 2.0;
            }
        }
    }
};

function test() {
    var g = exports.getNewGame();
    var p = new Player();
    p.setName("player1");
    console.log(p.name);
    
};


//test();





