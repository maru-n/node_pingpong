exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
};

var Player = require('player').Player;
var Field = require('field').Field;

const MAX_PLAYER_NUM = 3;
const UPDATE_INTERVAL_MSEC = 20;

var Game = function() {
    this.id = Math.floor(Math.random() * 1000);
    //this.players = {};
    this.players = new Array();
    this.field = new Field();
    //"setup", "play", "pause", "end"
    this.gamePhase = "setup";
};

Game.prototype = {
    addPlayer : function(socket, name) {
        var id = this.getPlayerNum()+1;
        var p = new Player(id);
        p.setSocket(socket);
        p.setName(name);
        p.setAngle( (id-1) * 2.0*Math.PI / MAX_PLAYER_NUM + Math.PI/2.0);
        p.setNewColor( (id-1), MAX_PLAYER_NUM);
        this.players[p.id] = p;
        this.field.setPlayers(p);
        this.setup();
        if(!this.isWaitingGame()){
            this.start();
        }
    },

    setup: function() {
        for( var i in this.players ) {
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
        this.gamePhase = "end";
        var data ={};
        this.sendData2AllPlayers('end', data);
    },

    play: function() {
        this.gamePhase = "play";
        this.field.initPosition();
        var data = {
            "gameData": this.getJson(),
            "fieldData": this.field.getJson(),
            "playerData": this.getPlayerDataArray()
        };
        this.sendData2AllPlayers('play', data);
        this.startUpdate();
    },

    pause: function() {
        this.stopUpdate();
        this.gamePhase = "pause";
        var data = {};
        this.sendData2AllPlayers('pause', data);
        
        //ゲーム終了判定
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
            this.pause();
        }
        var data ={
            "fieldData": this.field.getJson(),
            "playerData": this.getPlayerDataArray()
        };
        this.sendData2AllPlayers('update', data);
    },
    
    getPlayerNum : function() {
	    var cnt = 0;
	    for(var k in this.players){ 
            cnt++;
        }
	    return cnt;
    },

    sendData2AllPlayers : function(msgName, data) {
        for( var i in this.players ) {
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
        var playerData = {};
        for(var i in this.players) {
            playerData[i] = this.players[i].getJson();
        };
        return playerData;
    }
};
