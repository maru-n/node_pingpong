var socket = io.connect('http://'+location.hostname, {
    'reconnect': false
});

function init(){
    
    var stage = new Kinetic.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight
    });
    var layer = new Kinetic.Layer();

    const FIELD_CENTER_X = stage.getWidth() / 2;
    const FIELD_CENTER_Y = stage.getHeight() / 2;
    const FIELD_RADIUS = 0.9 * ( stage.getWidth()>stage.getHeight()?stage.getHeight():stage.getWidth() ) / 2;

    var fieldCircle = new Kinetic.Circle({
        x: FIELD_CENTER_X,
        y: FIELD_CENTER_Y,
        radius: FIELD_RADIUS,
        stroke: 'black',
        strokeWidth: 0.1
    });

    layer.add(fieldCircle);
    var ball = new Kinetic.Circle({
        radius: 5,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 0.1
    });

    // add the shape to the layer
    stage.add(layer);
    
    // cursols[id]にそのIDのplayerの操作するカーソルが入る
    //var cursols = new Array();    
    var cursols = {};
    var setupHandler = function(data) {
        console.log("setup");
        console.log(data);
        for( var i in data.playerData ) {
            if( !cursols[data.playerData[i].id] ) {
                var p = data.playerData[i];
                var c = new Kinetic.Rect({
                    angle: p.angle,
                    x: FIELD_CENTER_X + FIELD_RADIUS * Math.cos(p.angle),
                    y: FIELD_CENTER_Y + FIELD_RADIUS * Math.sin(p.angle),
                    width: p.width * FIELD_RADIUS,
                    height: 5,
                    fill: p.color,
                    stroke: 'black',
                    strokeWidth: 0.1,
                    offset: [p.width * FIELD_RADIUS / 2.0, 5. / 2.]
                });
                c.setRotation(p.angle+Math.PI/2.0);
                layer.add(c);
                cursols[data.playerData[i].id] = c;
            }
        }
        layer.draw();
    };

    var startHandler = function(data) {
        console.log("start");
        console.log(data);
        socket.on("play", playHandler);
        socket.on("pause", pauseHandler);
    };

    var playHandler =  function(data) {
        console.log("play");
        console.log(data);
        ball.setPosition(FIELD_CENTER_X + FIELD_RADIUS * data.fieldData.ballX,
                         FIELD_CENTER_Y + FIELD_RADIUS * data.fieldData.ballY);
        layer.add(ball);
        layer.draw();

        socket.on("update", updateHandler);
    };

    var pauseHandler = function(data) {
        console.log("pause");
        console.log(data);
    };

    var updateHandler = function(data) {
        //console.log("update");
        //console.log(data);
        for(var i in data.playerData) {
            var p = data.playerData[i];
            cursols[p.id].setPosition(FIELD_CENTER_X + FIELD_RADIUS * Math.cos(p.angle),
                                      FIELD_CENTER_Y + FIELD_RADIUS * Math.sin(p.angle));
            cursols[p.id].setRotation(p.angle+Math.PI/2.0);
        }
        ball.setPosition(FIELD_CENTER_X + FIELD_RADIUS * data.fieldData.ballX,
                         FIELD_CENTER_Y + FIELD_RADIUS * data.fieldData.ballY);
        layer.draw();
    };

    socket.on('setup', setupHandler);
    socket.on('start', startHandler);

    // キーボード操作
    $(window).keydown(function(e) {
        switch(e.keyCode){
        case 37: //left
        case 39: //right
        case 48: case 49: case 50: case 51: case 52:
        case 53: case 54: case 55: case 56: case 57: //0~9 
            socket.emit("action", {"keydown": e.keyCode});
            break;
        }
    });
    $(window).keyup(function(e) {
        switch(e.keyCode){
        case 37: //left
        case 39: //right
            socket.emit("action", {"keyup": e.keyCode});
            break;
        }
    });
    

    //切断されたときのハンドラ
    socket.on('disconnect', function(message){
        console.log("disconnected");
        console.log(message);
    });
}

$(document).ready(function(){
    init();
});








