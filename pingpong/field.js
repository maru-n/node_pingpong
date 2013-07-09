const BALL_INITIAL_VEL = 0.01;
const FIELD_RADIUS = 1.0;

var Field = function() {
    this.players = new Array();
    this.init();
};

Field.prototype = {
    setPlayers: function(p) {
        this.players[p.id] = p;
    },
    init: function() {
        this.ballX = 0.0;
        this.ballY = 0.0;
        var a = Math.random() * Math.PI * 2.0;
        this.ballVX = BALL_INITIAL_VEL * Math.cos(a);
        this.ballVY = BALL_INITIAL_VEL * Math.sin(a);
        this.ballOut = false;
        this.setTargetPlayerId(0);
    },

    getBallColor: function() {
        if( this.players[this.ballTargetPlayerId] ) {
            return this.players[this.ballTargetPlayerId].color;
        }else{
            return "#000000";
        }
    },

    setTargetPlayerId: function(i) {
        if( i in this.players ) {
            this.ballTargetPlayerId = i;
        }else{
            var n = 0;
            for( i in this.players ) {
                n++;
            }
            this.ballTargetPlayerId = parseInt(Math.random() * n)+1;
        }
    },

    update: function() {
        for( var i in this.players ) {
            this.players[i].updatePosition();
        }

        //update ball position
        this.ballX += this.ballVX;
        this.ballY += this.ballVY;

        //refrection
        if(  Math.sqrt(Math.pow(this.ballX,2) + Math.pow(this.ballY,2)) >= FIELD_RADIUS ) {
            var ballAngle = Math.atan2(this.ballY, this.ballX);
            this.ballOut = true;
            for( i in this.players ) {
                var p = this.players[i];
                var pAng = (p.angle >= Math.PI) ? p.angle-Math.PI*2.0 : p.angle;
                var pAng1 = pAng - p.width/2/FIELD_RADIUS;
                var pAng2 = pAng + p.width/2/FIELD_RADIUS;
                if( pAng1 < ballAngle && pAng2 > ballAngle) {
                    this.ballVX *= -1;
                    this.ballVY *= -1;
                    this.setTargetPlayerId( p.targetId );
                    this.ballOut = false;
                    break;
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
            "ballY": this.ballY,
            "ballColor": this.getBallColor()
        };
        return json;
    }
};

exports.Field = Field;
