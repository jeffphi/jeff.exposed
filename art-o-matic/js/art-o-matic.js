

var game = new Phaser.Game(420, 1299, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.crossOrigin = 'anonymous';
    game.load.image('epic',   './assets/epic-thumb.jpg');
    game.load.image('beyond', './assets/beyond-thumb.jpg');
    game.load.image('joy',    './assets/joy_thumb.jpg');
    game.load.image('holiday', './assets/holiday_thumb.jpg');
}

function create() {
    game.physics.setBoundsToWorld();

    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, window.innerWidth, window.innerHeight);

    //spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //spaceKey.onDown.add(togglePause, this);
    game.physics.arcade.isPaused = true; 
    game.time.events.add(Phaser.Timer.SECOND * 2, startPhysics, this);

    //Groups
    //var g1 = game.add.group();

    var epic = game.add.sprite(10, 10, 'epic');
    epic.url = './epic.html';
    var beyond = game.add.sprite(10, 420, 'beyond');
    beyond.url = './beyond.html';
    var joy = game.add.sprite(10, 679, 'joy');
    joy.url = './joy.html';
    var holiday = game.add.sprite(10, 889, 'holiday');
    holiday.url = './holiday.html';

    epic.inputEnabled = true;    
    epic.events.onInputDown.add(onDown, this);
    beyond.inputEnabled = true;    
    beyond.events.onInputDown.add(onDown, this);
    joy.inputEnabled = true;    
    joy.events.onInputDown.add(onDown, this);
    holiday.inputEnabled = true;
    holiday.events.onInputDown.add(onDown, this);
}

function onDown(sprite, pointer){
   window.location.href = sprite.url;
}

function startPhysics() {
    game.physics.arcade.isPaused = false;
}

function update() {

}

