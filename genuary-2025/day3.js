let rotation = 0;
let scaleVal = 1;
let bgColor = 180;
let fgColor = 0;

function setup() {
  createCanvas(displayWidth, displayHeight);
  textFont('Verdana');
}

function draw() {

  frameRate(30);
  colorMode(HSB);
  background(color(bgColor % 360, 100, 100));
  
  fill("black");
  textSize(20);
  strokeWeight(1);
  text('Day 3: Exactly 42 lines of code.', 20, 30);
  textSize(10);

  fill(color(fgColor % 360, 100, 100));
  bgColor++;
  fgColor++;

  angleMode(DEGREES);

  push();
  translate(displayWidth/2, displayHeight/2);
  rotation += random(-15, 15);
  rotate(rotation);
  scaleVal += 0.2;
  scale(scaleVal);
  textAlign(CENTER);
  text('42', random(-10, 5), random(-10, 10));
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}