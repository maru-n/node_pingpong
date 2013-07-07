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

    var cursols = new Array();
    /*
    var myCursol = new Kinetic.Rect({
        x: 300,
        y: field.getHeight() - CURSOL_HEIGHT - 50,
        width: CURSOL_WIDTH,
        height: CURSOL_HEIGHT,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2
    });
    layer.add(myCursol);
     */
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
    
    //for debug
    var consoleLogHandler = function(data) {
        console.log(data);
    };

    var setupHandler = function(data) {
        console.log(data);
        for( var i=0; i<data.playerData.length; i++) {
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
            c.rotate(p.angle+Math.PI/2.0);
            layer.add(c);
        }
        layer.draw();
    };

    socket.on('setup', setupHandler);
    socket.on('start', consoleLogHandler);

    //切断されたときのハンドラ
    socket.on('disconnect', function(message){
        console.log(message);
        console.log("disconnected");
    });

    // キーボード操作
    var rightKeyPressed = false;
    var leftKeyPressed = false;
    $(window).keydown(function(e) {
        /*
        var dx = 1;        
        var moveFunc = function(dx) {
            var pos = myCursol.getPosition();
            var newX = pos.x + dx;
            if( newX < 0 ) {
                newX = 0;
            }else if( newX > field.getWidth() - myCursol.getWidth() ) {
                newX = field.getWidth() - myCursol.getWidth();
            }
            myCursol.setPosition(newX, pos.y);
            layer.draw();

            // サーバにXの位置を送信
            var absPosX = (newX + myCursol.getWidth()/2) / field.getWidth();
            var msg = {cursolX: absPosX};
            socket.emit('pos', msg);
        };
        
        if (e.keyCode == 37) {
            // left
            leftKeyPressed = true;
            setTimeout( function(){
                moveFunc(-dx);
                if( leftKeyPressed ) {
                    setTimeout(arguments.callee, 0);
                }
            }, 0);
        }else if (e.keyCode == 39) {
            //right
            rightKeyPressed = true;
            setTimeout(function(){
                moveFunc(dx);
                if( rightKeyPressed ) {
                    setTimeout(arguments.callee, 0);
                }
            }, 0);
        }
        return;
         */
    });
    $(window).keyup(function(e) {
        if (e.keyCode == 37) {
            leftKeyPressed = false;
        }else if (e.keyCode == 39) {
            rightKeyPressed = false;
        }
    });
}

$(document).ready(function(){
    init();
});





