const BALL_INITIAL_VEL = 0.01;
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
        this.ballVX = BALL_INITIAL_VEL * Math.cos(a);
        this.ballVY = BALL_INITIAL_VEL * Math.sin(a);
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

exports.Field = Field;
