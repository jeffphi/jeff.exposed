
var game = new Phaser.Game(795, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var card;
var cursors;

function preload() {
    game.load.crossOrigin = 'anonymous';
    game.load.image('maze', './assets/choices-in-red-maze.png?v=1716051365458');
}

function create() {
    game.stage.backgroundColor = "#CBEBFF";

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(400, 300, window.innerWidth, window.innerHeight);

    card = game.add.sprite(0, 0, 'maze');
    card1 = game.add.sprite(0, -800, 'maze');
    card2 = game.add.sprite(795, 0, 'maze');
    card3 = game.add.sprite(0, 800, 'maze');
    card4 = game.add.sprite(-795, 0, 'maze');
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    if (cursors.left.isDown)
    {
        card.x -= 4;
        card1.x -= 4;
        card2.x -= 4;
        card3.x -= 4;
        card4.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        card.x += 4;
        card1.x += 4;
        card2.x += 4;
        card3.x += 4;
        card4.x += 4;
    }

    if (cursors.up.isDown)
    {
        card.y -= 4;
        card1.y -= 4;
        card2.y -= 4;
        card3.y -= 4;
        card4.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        card.y += 4;
        card1.y += 4;
        card2.y += 4;
        card3.y += 4;
        card4.y += 4;
    }

    game.world.wrap(card, 0, true);
    game.world.wrap(card1, 0, true);
    game.world.wrap(card2, 0, true);
    game.world.wrap(card3, 0, true);
    game.world.wrap(card4, 0, true);

}
