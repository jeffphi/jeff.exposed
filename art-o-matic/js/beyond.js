
var game = new Phaser.Game(1100, 686, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var g1, g2;

function preload() {
    game.load.crossOrigin = 'anonymous';
    game.load.image('bar',  './assets/beyond-vertical-bar.png?v=1716051364240');
    game.load.image('black-bar',  './assets/beyond-vertical-black-bar.png?v=1716051364579');
    game.load.image('ball-1', './assets/purple-ball-1.png?v=1716051368381');
    game.load.image('ball-2', './assets/purple-ball-2.png?v=1716051368684');
    game.load.image('ball-3', './assets/purple-ball-3.png?v=1716051368914');
    game.load.image('ball-4', './assets/purple-ball-4.png?v=1716051369203');
    game.load.image('ball-5', './assets/purple-ball-5.png?v=1716051369498');
    game.load.image('ball-6', './assets/purple-ball-6.png?v=1716051370117');
    game.load.image('ball-7', './assets/purple-ball-7.png?v=1716051370364');
    game.load.image('ball-8', './assets/purple-ball-8.png?v=1716051370627');
    game.load.image('ball-9', './assets/purple-ball-9.png?v=1716051370906');
    game.load.image('ball-10', './assets/purple-ball-10.png?v=1716051371129');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#DADAC0";
    game.physics.setBoundsToWorld();

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, window.innerWidth, window.innerHeight);

    g1 = game.add.group();
    g2 = game.add.group();


    var curX = 0;
    while(curX < 1100){
                
        // Black Bar
        var blackBar = game.add.sprite(curX,0,'black-bar');
        var tempWidth = game.rnd.integerInRange(3, 12);
        blackBar.width = tempWidth;
        curX += tempWidth;

        if(curX >= 1085){
            var blackBar = game.add.sprite(curX,0,'black-bar');
            blackBar.width = 1100 - curX;
            curX = 1100;
            continue;
        }

        // Window Bar
        var curY = game.rnd.integerInRange(-146, 0);
        var bar = game.add.sprite(curX,curY,'bar');
        curX += 12;

        g2.add(blackBar);
        g2.add(bar);

        var tween = game.add.tween(bar);
        var delay = game.rnd.integerInRange(0,10000);
        var speed = game.rnd.integerInRange(2000, 10000);
        var destY = game.rnd.integerInRange(-146, 0);
        tween.to({ y: destY }, speed, 'Linear', true, delay, -1, true);
    }

    var ball1 =game.add.sprite(10, 28, 'ball-1');
    ball1.scale.setTo(1.4, 1.4);
    animateBall(ball1, 1.4);
    var ball2 = game.add.sprite(0, 418, 'ball-2');
    ball2.scale.setTo(0.7, 0.7);
    animateBall(ball2, 0.7);
    var ball3 = game.add.sprite(288, 450, 'ball-3');
    ball3.scale.setTo(0.4, 0.4);
    animateBall(ball3, 0.4);
    var ball4 = game.add.sprite(412, 80, 'ball-4');
    ball4.scale.setTo(0.3, 0.3);
    animateBall(ball4, 0.3);
    var ball5 = game.add.sprite(388, 248, 'ball-5');
    ball5.scale.setTo(0.7, 0.7);
    animateBall(ball5, 0.7);
    var ball6 = game.add.sprite(608, 122, 'ball-6');
    ball6.scale.setTo(0.4, 0.4);
    animateBall(ball6, 0.4);
    var ball7 = game.add.sprite(706, 260, 'ball-7');
    ball7.scale.setTo(0.3, 0.3);
    animateBall(ball7, 0.3);
    var ball8 = game.add.sprite(565, 401, 'ball-8');
    //ball8.scale.setTo(1.0, 1.0);
    animateBall(ball8, 1.0);
    var ball9 = game.add.sprite(788, 32, 'ball-9');
    //ball9.scale.setTo(1.0, 1.0);
    animateBall(ball9, 1.0);
    var ball10 = game.add.sprite(878, 339, 'ball-10');
    ball10.scale.setTo(0.7, 0.7);
    animateBall(ball10, 0.7);

    g1.add(ball1);
    g1.add(ball2);
    g1.add(ball3);
    g1.add(ball4);
    g1.add(ball5);
    g1.add(ball6);
    g1.add(ball7);
    g1.add(ball8);
    g1.add(ball9);
    g1.add(ball10);
}

function animateBall(ball, val){
   var speed = game.rnd.integerInRange(3000, 9000); 
   var delay = game.rnd.integerInRange(0, 5000);
   var range = game.rnd.integerInRange(-75, 75);
   //game.add.tween(ball.scale).to( { x: val, y: val }, speed, Phaser.Easing.Linear.None, true, 0, -1, true);

    var tempX = ball.x + range;
   tween = game.add.tween(ball).to( { x:tempX  }, speed, Phaser.Easing.Quartic.InOut, true, 0, -1, true);
   //tween = game.add.tween(ball).to( { x:tempX  }, speed, Phaser.Easing.Linear.None, true, 0, -1, true);

   // game.physics.enable(ball, Phaser.Physics.ARCADE);
   //ball.body.setCircle(134);
   //var x = game.rnd.integerInRange(5, 50);
   //var y = game.rnd.integerInRange(5, 50);
   //ball.body.velocity.setTo(x, y);     
   //ball.body.collideWorldBounds = true;
   //ball.body.bounce.set(0.5);
   //ball.body.mass = 100*val;
}


function update() {
    //game.physics.arcade.collide(g1);
}

