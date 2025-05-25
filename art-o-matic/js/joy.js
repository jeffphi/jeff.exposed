
var game = new Phaser.Game(1100, 551, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var blue_tracker = [];
blue_tracker.color = 'blue';
var orange_tracker = [];
orange_tracker.color = 'orange';
var purple_tracker = [];
purple_tracker.color = 'purple';
var red_tracker = [];
red_tracker.color = 'red';

function preload() {
    game.load.crossOrigin = 'anonymous';
    // 95x95
    game.load.image('blue',   './assets/joy-blue.png?v=1716051367435');
    game.load.image('orange', './assets/joy-orange.png?v=1716051367683');
    game.load.image('purple', './assets/joy-purple.png?v=1716051367901');
    game.load.image('red',    './assets/joy-red.png?v=1716051368131');
}

function create() {
    game.stage.backgroundColor = "#D9D2B4";

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, window.innerWidth, window.innerHeight);

    for(var i = 0; i < 25; i++){
       addSquare(blue_tracker);
       addSquare(orange_tracker);
       addSquare(purple_tracker);
       addSquare(red_tracker);
    }
}

function addSquare(tracker){
   while(true){
      var x = game.rnd.integerInRange(-85, 1090);
      var y = game.rnd.integerInRange(-85, 541);
      if(canAddSquare(x, y, tracker)){
         var square = game.add.sprite(x, y, tracker.color);
         square.alpha = 0;
         var delay = game.rnd.integerInRange(0, 10000);
         var duration = game.rnd.integerInRange(3000, 10000);
         game.add.tween(square).to( { alpha: 1 }, duration, Phaser.Easing.Quadratic.Out, true, delay, -1, true);
         tracker.push(square);
         return;
      }
   }
}

function canAddSquare(x, y, tracker){
   for(var i = 0; i< tracker.length; i++){      
      if(Phaser.Math.distance(x, y, tracker[i].x, tracker[i].y) < 145){
         return false;
      }
   }
   return true;
}

function update() {
}

