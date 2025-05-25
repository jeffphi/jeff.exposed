let minX;
let maxX;
let minY;
let maxY;
let inc;
let degree = 0;
let xStart;
let yStart;
let length;
let bigZ = 0;
let leftZ = 0;
let rightZ = 0;
let topZ = 0;
let bottomZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  minX = windowWidth / 4;
  maxX = windowWidth * 3 / 4;
  minY = windowHeight / 4;
  maxY = windowHeight * 3 / 4;
  inc = (windowHeight / 2) / 20;

  length = 250;
  xStart = (windowWidth / 2) - 350 - (length / 2);
  yStart = (windowHeight / 2) - 350 + 50;

}

function draw() {
  background('white');
  fill('black');
  textSize(20);
  textAlign(LEFT);
  text('Day 5: Isometric Art (No vanishing points).', 20, 30);
  frameRate(30);
  /*
  angleMode(DEGREES);
  shearX(-30);
  //rotate(30);

  //Draw grid
  // Verical lines
  for(let x = minX; x < maxX; x += inc){
    line(x, minY, x, maxY);
  }

  //Horizontal lines
  for(let y = minY; y < maxY; y += inc){
    line(minX, y, maxX, y);
  }
    */

  /*
  //x, y, w, h, l
  for (let i = 0; i < 100; i++) {
    drawIsoBlock(
      random(-200, windowWidth),
      random(-200, windowHeight),
      random(50, 300), random(50, 300), random(50, 300));
  }
 

  for (let i = 0; i < 100; i++) {
    drawIsoBlock(
      random(-200, windowWidth),
      random(-200, windowHeight),
      random(1, 30), random(1, 30), random(1, 30));
  }
       */

  /*
  for(let i = 10; i < 100; i++){

    //translate(windowWidth/2, windowHeight/2);
    //angleMode(DEGREES);
    //rotate(degree++);
    //scale(0.3);

    for(let j = 10; j < 50; j++){
      drawIsoBlock(i*10 + random(0, 10), j*10+random(0, 10), 20,20,20);
    }
  }
  */

  // Left side
  for (let y = 600 + yStart; y >= yStart; y -= 150) {
    drawIsoBlock(xStart + (leftZ * cos(30)), y - (leftZ * cos(30)), 100, 100, length);
  }

  // Bottom middle
  for (let x = 150 + xStart; x <= 450 + xStart; x += 150) {
    drawIsoBlock(x + (bottomZ * cos(30)), yStart + 600 - (bottomZ * cos(30)), 100, 100, length);
  }

  // Middle
  //drawIsoBlock(xStart + 150, yStart + 150, 400, 400, length);
  //x + (l * cos(30)), y - (l * sin(30))
  drawIsoBlock(xStart + 150 + (bigZ * cos(30)), yStart + 150 - (bigZ * sin(30)), 400, 400, length);

  // Top middle
  for (let x = 150 + xStart; x <= 450 + xStart; x += 150) {
    drawIsoBlock(x + (topZ * cos(30)), yStart - (topZ * cos(30)), 100, 100, length);
  }

  // Right side
  for (let y = yStart + 600; y >= yStart; y -= 150) {
    drawIsoBlock(xStart + 600 + (rightZ * cos(30)), y - (rightZ * cos(30)), 100, 100, length);
  }

  // Initial delay and then animate
  if (frameCount > 30) {
    
    // Left
    if (frameCount % 200 < 100) {
      leftZ = leftZ - 2;
    }
    else {
      leftZ = leftZ + 2;
    }

    if (frameCount > 60) {
      // Top
      if (frameCount % 300 < 150) {
        topZ = topZ - 1;
      }
      else {
        topZ = topZ + 1;
      }
    }

    if (frameCount > 90) {
      // Top
      if (frameCount % 275 < 137.5) {
        rightZ = rightZ - 1.5;
      }
      else {
        rightZ = rightZ + 1.5;
      }
    }

    if (frameCount > 120) {
      // Top
      if (frameCount % 600 < 300) {
        bottomZ = bottomZ - 1;
      }
      else {
        bottomZ = bottomZ + 1;
      }
    }
  }
}

function drawIsoBlock(x, y, w, h, l) {

  //front face
  fill('red')
  rect(x, y, w, h);

  //top
  push();
  angleMode(DEGREES);
  fill('yellow');
  quad(
    x, y,
    x + (l * cos(30)), y - (l * sin(30)),
    x + (l * cos(30)) + w, y - (l * sin(30)),
    x + w, y);
  pop();

  //right
  push();
  angleMode(DEGREES);
  fill('blue');
  quad(
    x + w, y,
    x + w + l * cos(30), y - (l * sin(30)),
    x + w + l * cos(30), y + h - (l * sin(30)),
    x + w, y + h);
  pop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
