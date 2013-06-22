var socket = io.connect('http://'+location.hostname, {
    'reconnect': false
});

function init(){
    
    const STAGE_WIDTH = 640;
    const STAGE_HEIGHT = 640;

    const CURSOL_WIDTH = 100;
    const CURSOL_HEIGHT = 50;
    
    var stage = new Kinetic.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight
    });
    
    var layer = new Kinetic.Layer();

    var field = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: stage.getWidth(),
        height: stage.getHeight(),
        fill: 'grey'
    });
    layer.add(field);
    
    var cursol = new Kinetic.Rect({
        x: 300,
        y: 400,
        width: CURSOL_WIDTH,
        height: CURSOL_HEIGHT,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2
    });
    layer.add(cursol);

    var otherRect =  new Kinetic.Rect({
        x: 300,
        y: 100,
        width: 100,
        height: 50,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2
    });
    layer.add(otherRect);

    var ball = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2
      });

    // add the shape to the layer
    layer.add(ball);
    stage.add(layer);
    
    //socket.send()で送信されたメッセージは'message'のハンドラで取得できる。
    socket.on('update', function (data) {
        // ball
        var absBallPosX = data.ballX;
        var absBallPosY = data.ballY;
        var ballX = absBallPosX * field.getWidth() - ball.getRadius()/2;
        var ballY = absBallPosY * field.getHeight() - ball.getRadius()/2;
        ball.setPosition(ballX, ballY);

        // other position
        var absOtherPosX = data.otherX;
        var otherX = absOtherPosX * field.getWidth() - otherRect.getWidth()/2;
        otherRect.setPosition(otherX, otherRect.getPosition().y);
        layer.draw();
    });

    //切断されたときのハンドラ
    socket.on('disconnect', function(message){
      $("#message-area").append('切断されました');
    });

    // キーボード操作
    var rightKeyPressed = false;
    var leftKeyPressed = false;
    $(window).keydown(function(e) {
        var dx = 1;        
        var moveFunc = function(dx) {
            var pos = cursol.getPosition();
            var newX = pos.x + dx;
            if( newX < 0 ) {
                newX = 0;
            }else if( newX > field.getWidth() - cursol.getWidth() ) {
                newX = field.getWidth() - cursol.getWidth();
            }
            cursol.setPosition(newX, pos.y);
            layer.draw();

            // サーバにXの位置を送信
            var absPosX = dx / field.getWidth();
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



