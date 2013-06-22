exports.getNewGame = function() {
    var args = arguments;
    var game = new Game();
    return game;
}

var Game = function() {
    this.playerNum = 0;
}

Game.prototype = {
    setSocket : function(socket) {
    },

    getPlayerNum : function() {
        return this.playerNum;
    }
};

function test() {
    var game = exports.getNewGame();
    console.log(game.getPlayerNum());
}

//test();