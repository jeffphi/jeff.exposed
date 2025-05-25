
var game = new Phaser.Game(805, 805, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var tracker = [];

function preload() {
    game.load.crossOrigin = 'anonymous';
    game.load.image('square',  './assets/holiday-black-square.png?v=1716051366520');
    game.load.image('circle',  './assets/holiday-red-circle.png?v=1716051366780');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#FDCEB0";
    game.physics.setBoundsToWorld();

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, window.innerWidth, window.innerHeight);

    for(var row  = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){         
            var x = 30 + 95*col;
            var y = 30 + 95*row;

            game.add.sprite(x,y,'square');
        }
    }

    for(var i = 0; i < 21; i++){
        while(true){
            var x = game.rnd.integerInRange(-80, 780);
            var y = game.rnd.integerInRange(-80, 780);
            if(canAddCircle(x, y)){
                var circle = game.add.sprite(x, y, 'circle');
                tracker.push(circle);
                circle.anchor.x = 0.5;
                circle.anchor.y = 0.5;
                var sc = game.rnd.realInRange(0.4, 1.0);
                circle.alpha = 0.9;
                circle.scale.setTo(sc, sc);    

                var delay = game.rnd.integerInRange(0, 8000);
                var duration = game.rnd.integerInRange(1000, 10000);
                game.add.tween(circle.scale).to({ x: 0.1, y: 0.1 }, duration, Phaser.Easing.Linear.None, true, delay, -1, false);
                break;
            }
        }
    }
}

function canAddCircle(x,y){
    for(var i = 0; i < tracker.length; i++){
        if(Phaser.Math.distance(x, y, tracker[i].x, tracker[i].y) < 160){
            return false;
        }
    }

    return true;
}

function update() {
    //game.physics.arcade.collide(g1);
}

