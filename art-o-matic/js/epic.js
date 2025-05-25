

var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.crossOrigin = 'anonymous';
    game.load.image('aqua-bar',   './assets/15x800-aqua.png');
    game.load.image('yellow-bar', './assets/15x800-yellow.png');
    game.load.image('red-ball',   './assets/red-ball.png');
}



function create() {
    game.physics.setBoundsToWorld();

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, window.innerWidth, window.innerHeight);

    //spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //spaceKey.onDown.add(togglePause, this);
    game.physics.arcade.isPaused = true; 
    game.time.events.add(Phaser.Timer.SECOND * 2, startPhysics, this);

    //Groups
    var g1 = game.add.group();
    var g2 = game.add.group();
    var g3 = game.add.group();
    var g4 = game.add.group();
    var g5 = game.add.group();
    var g6 = game.add.group();
    var g7 = game.add.group();
    var g8 = game.add.group();
    var g9 = game.add.group();
    var g10 = game.add.group();
    var g11 = game.add.group();
    var g12 = game.add.group();
    var g13 = game.add.group();
    var g14 = game.add.group();
    var g15 = game.add.group();

    bar1 = game.add.sprite(0, 0, 'yellow-bar');
    bar1.height = 355;
    bar2 = game.add.sprite(0, 355, 'aqua-bar');
    bar2.height = 15;
    bar3 = game.add.sprite(0, 370, 'yellow-bar');
    bar4 = game.add.sprite(0, 385, 'aqua-bar');
    bar4.height = 20;
    bar5 = game.add.sprite(0, 405, 'yellow-bar');
    bar6 = game.add.sprite(0, 420, 'aqua-bar');
    bar6.height = 30;
    bar7 = game.add.sprite(0, 450, 'yellow-bar');
    bar8 = game.add.sprite(0, 465, 'aqua-bar');
    bar8.height = 32;
    bar9 = game.add.sprite(0, 497, 'yellow-bar');
    bar10 = game.add.sprite(0, 512, 'aqua-bar');
    bar10.height = 47;
    bar11 = game.add.sprite(0, 559, 'yellow-bar');
    bar12 = game.add.sprite(0, 574, 'aqua-bar');
    bar12.height = 52;
    bar13 = game.add.sprite(0, 626, 'yellow-bar');
    bar14 = game.add.sprite(0, 641, 'aqua-bar');
    bar14.height = 67;
    bar15 = game.add.sprite(0, 708, 'yellow-bar');
    bar16 = game.add.sprite(0, 723, 'aqua-bar');
    bar16.height = 77;

    g1.add(bar1);
    g1.add(bar2);
    g3.add(bar3);
    g3.add(bar4);
    g5.add(bar5);
    g5.add(bar6);
    g7.add(bar7);
    g7.add(bar8);
    g9.add(bar9);
    g9.add(bar10);
    g11.add(bar11);
    g11.add(bar12);
    g13.add(bar13);
    g13.add(bar14);
    g15.add(bar15);
    g15.add(bar16);

    var ball1 = game.add.sprite(600, 350, 'red-ball');
    ball1.scale.setTo(0.4, 0.4);
    initBall(ball1);
    g2.add(ball1);

    var ball2 = game.add.sprite(350, 380, 'red-ball');
    ball2.scale.setTo(0.5, 0.5);
    initBall(ball2);
    g4.add(ball2);

    var ball3 = game.add.sprite(100, 410, 'red-ball');
    ball3.scale.setTo(0.6, 0.6);
    g6.add(ball3);
    var ball4 = game.add.sprite(720, 410, 'red-ball');
    ball4.scale.setTo(0.6, 0.6);
    g6.add(ball4);
    initBalls(ball3, ball4);

    var ball5 = game.add.sprite(-40, 440, 'red-ball');
    ball5.scale.setTo(0.8, 0.8);
    g8.add(ball5);
    var ball6 = game.add.sprite(500, 450, 'red-ball');
    ball6.scale.setTo(0.8, 0.8);
    g8.add(ball6);
    initBalls(ball5, ball6);

    var ball7 = game.add.sprite(200, 505, 'red-ball');
    initBall(ball7);
    g10.add(ball7);

    var ball8 = game.add.sprite(600, 540, 'red-ball');
    g12.add(ball8);
    var ball9 = game.add.sprite(-30, 560, 'red-ball');
    g12.add(ball9);
    initBalls(ball8, ball9);

    var ball10 = game.add.sprite(340, 590, 'red-ball');
    initBall(ball10);
    g14.add(ball10);
}

function initBall(ball){
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballOut, this);
    ball.body.velocity.x = -100 + Math.random() * 200;    
    ball.lastVelocity = ball.body.velocity.x;
}

function initBalls(ball1, ball2){
    game.physics.enable(ball1, Phaser.Physics.ARCADE);
    game.physics.enable(ball2, Phaser.Physics.ARCADE);
    ball1.checkWorldBounds = true;
    ball2.checkWorldBounds = true;
    ball1.events.onOutOfBounds.add(ballOut, this);
    ball2.events.onOutOfBounds.add(ballOut, this);

    ball1.body.velocity.x = -100 + Math.random() * 200;
    ball1.lastVelocity = ball1.body.velocity.x;
    ball2.body.velocity.x = ball1.body.velocity.x;
    ball2.lastVelocity = ball2.body.velocity.x;
}

function ballOut(ball){
    if(ball.lastVelocity > 0){
	ball.x = -200;
    }
    else{
	ball.x = 800;
    }
    ball.body.velocity.x = ball.lastVelocity;
}

function startPhysics() {
    game.physics.arcade.isPaused = false;
}

function update() {

}

