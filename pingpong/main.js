var socket = io.connect('http://'+location.hostname, {
    'reconnect': false
});



function init(){
    
    const STAGE_WIDTH = 640;
    const STAGE_HEIGHT = 640;

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



    /*
    var ball = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1
    });
    layer.add(ball);
     */

    // add the shape to the layer
    stage.add(layer);

    var cursols = new Array();    
    var setupHandler = function(data) {
        console.log("setup");
        console.log(data);
        for( var i=0; i<data.playerData.length; i++) {
            if( !cursols[i] ) {
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
                cursols[i] = c;
            }
        }
        layer.draw();
    };

    var startHandler = function(data) {
        console.log("start");
        console.log(data);
        socket.on("play", playHandler);
    };

    var playHandler =  function(data) {
        console.log("play");
        console.log(data);
        socket.on("update", updateHandler);
    };

    var updateHandler = function(data) {
        //console.log("update");
        //console.log(data);
        for( var i=0; i<data.playerData.length; i++) {
            var p = data.playerData[i];
            cursols[p.id].setPosition(FIELD_CENTER_X + FIELD_RADIUS * Math.cos(p.angle),
                                      FIELD_CENTER_Y + FIELD_RADIUS * Math.sin(p.angle));
            cursols[p.id].setRotation(p.angle+Math.PI/2.0);
        }
        layer.draw();
    };

    socket.on('setup', setupHandler);
    socket.on('start', startHandler);

    // キーボード操作
    $(window).keydown(function(e) {
        switch(e.keyCode){
        case 37: //left
        case 39: //right
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







