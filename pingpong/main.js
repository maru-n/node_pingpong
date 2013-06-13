    //これはテストです。gingbear
    //reconnect:falseは、切断した時に再接続しないため。
    //これを入れないと、サーバが落ちた時にエラーでる。
    var socket = io.connect('http://'+location.hostname, {
      'reconnect': false
    });


function init(){

    const STAGE_WIDTH = 640;
    const STAGE_HEIGHT = 480;

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
    
    var rect = new Kinetic.Rect({
        x: 300,
        y: 400,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2
    });
    layer.add(rect);

    stage.add(layer);
    
    stage.on('mousemove', function() {
        var mousePos = stage.getMousePosition();
        var x = mousePos.x - rect.getWidth()/2;
        rect.setPosition(x, rect.getPosition().y);
        layer.draw();

        var absPosX = x / field.getWidth();
        var msg = {cursolX: absPosX};

        // サーバにXの位置を送信
        socket.send(msg);
    });

    //socket.send()で送信されたメッセージは'message'のハンドラで取得できる。
    socket.on('message', function (data) {
        var absPosX = data.getBallX;
        var absPosY = data.getBallY;
        var x = absPosX * field.getWidth() - rect.getWidth()/2;
        // var y = absPosY * field.getHeight() - rect.getHeight()/2;
        rect.setPosition(x, rect.getPosition().y);
        layer.draw();
    });

    //切断されたときのハンドラ
    socket.on('disconnect', function(message){
      $("#message-area").append('切断されました');
    });
}

$(document).ready(function(){
    init();
});