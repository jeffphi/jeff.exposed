
let items = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  let startTime = performance.now();
  while (items.length < 1000000) {
    items.push({
      x1: random(0, windowWidth),
      y1: random(0, windowHeight),
      x2: random(0, windowWidth),
      y2: random(0, windowHeight),
      hue: random(0, 360)
    });
  }
  let endTime = performance.now();
  console.log("Generate elapsed time: " + (endTime - startTime).toFixed(2) + "ms");

  colorMode(HSB);

  startTime = performance.now();
  for (let i = 0; i < items.length; i++) {
    stroke(color(items[i].hue, 100, 100));
    line(items[i].x1, items[i].y1, items[i].x2, items[i].y2);
  }
  endTime = performance.now();
  console.log("Draw elapsed time: " +
            (endTime - startTime).toFixed(2) +
            "ms");
}

function draw() {

  background('white');

  colorMode(HSB);
  for (let i = 0; i < items.length; i++) {
    stroke(color(items[i].hue, 100, 100));
    line(items[i].x1, items[i].y1, items[i].x2, items[i].y2);
  }

  fill('white');
  rect(0, 0, 400, 75);

  textSize(20);
  fill('black');
  stroke('black');
  text('Day 8: Draw one million of something. ', 20, 20);
  let pix = windowWidth * windowHeight;
  textSize(15);
  text('Window: ' + windowWidth + ' x ' + windowHeight + ' (' + pix + ' pixels)', 20, 40);
  text('Number of things: ' + items.length, 20, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
