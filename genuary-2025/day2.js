let items = [];
const numItems = 250;

function setup() {
  createCanvas(displayWidth, displayHeight);

  for(let i = 0; i < numItems; i++){
    let tempItem = {
      x: random(displayWidth),
      y:random(displayHeight) + 60,
      color: color(random(255),random(255),random(255), random(100,255)),
      text: 'Layer ' + i,
      textSize: random(10, 100),
      speed: random(1, 20)
    };

    items.push(tempItem);
  }
}

function draw() {
  //frameRate(30);
  background('black');
  fill('white');
  textSize(20);
  text('Day 2: Layers upon layers upon layers.', 20, 30);


  for(let i = 0; i < items.length; i++){
    let item = items[i];
    textSize(item.textSize);
    fill(item.color);
    text(item.text, item.x, item.y);

    item.x = (item.x + item.speed) % displayWidth;
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
