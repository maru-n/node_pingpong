//これはテストです。gingbear
//reconnect:falseは、切断した時に再接続しないため。
//これを入れないと、サーバが落ちた時にエラーでる。
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

    var field = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: stage.getWidth(),
        height: stage.getHeight(),
        fill: 'grey'
    });
    layer.add(field);
    
    var myRect = new Kinetic.Rect({
        x: 300,
        y: 400,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2
    });
    layer.add(myRect);

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
    
    // stage.on('mousemove', function() {
    //     var mousePos = stage.getMousePosition();
    //     var x = mousePos.x - myRect.getWidth()/2;
    //     myRect.setPosition(x, myRect.getPosition().y);
    //     layer.draw();

    //     var absPosX = x / field.getWidth();
    //     var msg = {cursolX: absPosX};

    //     // サーバにXの位置を送信
    //     socket.emit('pos', msg);
    // });

    //socket.send()で送信されたメッセージは'message'のハンドラで取得できる。
    socket.on('update', function (data) {
        // ball
        var absBallPosX = data.ballX;
        var absBallPosY = data.ballY;
        var ballX = absBallPosX * field.getWidth() - ball.getRadius()/2;
        var ballY = absBallPosY * field.getHeight() - ball.getRadius()/2;
        // console.log("ballX:"+ballX+"ballY"+ballY);
        ball.setPosition(ballX, ballY);

        // other position
        var absOtherPosX = data.otherX;
        var otherX = absOtherPosX * field.getWidth() - otherRect.getWidth()/2;
        // console.log("absOtherPosX:"+absOtherPosX+" otherX:"+otherX);
        otherRect.setPosition(otherX, otherRect.getPosition().y);
        // console.log("OtherX:"+otherRect.getPosition().x+"OtherY:"+otherRect.getPosition().x);
        layer.draw();
    });

    //切断されたときのハンドラ
    socket.on('disconnect', function(message){
      $("#message-area").append('切断されました');
    });

    // キーボード操作
    $(window).keydown(function(e) {
        if (e.keyCode == 37) {
            // left
            var crrX = myRect.getPosition().x;
            var dx = -10
            myRect.setPosition(crrX+dx, myRect.getPosition().y);
            layer.draw();

            var absPosX = dx / field.getWidth();
            var msg = {cursolX: absPosX};

            // サーバにXの位置を送信
            socket.emit('pos', msg);
            return;
        }
        if (e.keyCode == 39) {
            // right
            var crrX = myRect.getPosition().x;
            var dx = 10
            myRect.setPosition(crrX+dx, myRect.getPosition().y);
            layer.draw();

            var absPosX = dx / field.getWidth();
            var msg = {cursolX: absPosX};

            // サーバにXの位置を送信
            socket.emit('pos', msg);
            return;
        }
    });
}

$(document).ready(function(){
    init();
});


