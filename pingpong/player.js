const DELTA_THETA = 0.05;

var Player = function(id) {
    this.id = id;
    this.name = "anonimous";
    this.socket = null;
    this.angle = 0.0;
    this.width = 0.2;
    this.color = "#000000";
    this.score = 0;
    this.moving = null; //"left" or "right" or null
    this.targetId = 0;
};

Player.prototype = {
    setSocket: function(socket) {
        this.socket = socket;
        var self = this;
        this.socket.on('action', function (data) {
            switch (data.keydown) {
            case 37: //left
                self.moving = "left";
                break;
            case 39: //right
                self.moving = "right";
                break;
            }
            if(data.keydown >= 48 && data.keydown <= 57 ) {
                var keyNum = Number(data.keydown)-48;
                if( keyNum != self.id ) {
                    self.targetId = keyNum;
                }else{
                    self.targetId = 0;
                }
            }
            switch (data.keyup) {
            case 37: //left
                if( self.moving==="left" ) {
                    self.moving = null;
                }
                break;
            case 39: //right
                if( self.moving==="right" ) {
                    self.moving = null;
                }
                break;
            }
        });
    },
    setNewColor: function(n, max) {
        var color_h = n * 1.0/max;
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
    },
    setAngle: function(a) {
        this.angle = a;
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

exports.Player = Player;