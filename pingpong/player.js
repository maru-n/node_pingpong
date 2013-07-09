const DELTA_THETA = 0.05;

var Player = function(id, maxPlayerNum) {
    this.id = id;
    this.name = "anonimous";
    this.socket = null;
    this.angle = (id * 2.0*Math.PI / maxPlayerNum) + Math.PI/2.0;
    this.width = 0.2;
    var color_h = this.id * 1.0/maxPlayerNum;
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

exports.Player = Player;