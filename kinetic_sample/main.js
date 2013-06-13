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

    });
}

$(document).ready(function(){
    init();
});