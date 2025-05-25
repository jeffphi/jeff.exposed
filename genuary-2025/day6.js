function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  drawSky();
}

function draw() {
  stroke('black');
  textSize(20);
  text('Day 6: Make a landscape using only primitive shapes.', 20, 30);

  drawHills();
  drawWater();
}

function drawSky(){
  //Noise sky
  // Set the noise level and scale.
  let noiseLevel = 255;
  let noiseScale = 0.01;

  // Iterate from top to bottom.
  for (let y = 0; y < height/3; y += 1) {
    // Iterate from left to right.
    for (let x = 0; x < width; x += 1) {
      // Scale the input coordinates.
      let nx = noiseScale * x;
      let ny = noiseScale * y;

      // Compute the noise value.
      let c = noiseLevel * noise(nx, ny);

      // Draw the point.
      stroke(c);
      point(x, y);
    }
  }
}

function drawHills(){
  stroke('green');
  // Noise hills
  // Set the noise level and scale.
  let noiseLevelHills = 200;
  let noiseScaleHills = 0.02;


  // Scale the input coordinate.
  let x = frameCount /*% (width/3)*/;
  let nx = noiseScaleHills * x;

  // Compute the noise value.
  let y = noiseLevelHills * noise(nx);

  // Draw the line.
  line(x, 2*height/3, x, y+100);
}

function drawWater() {
  stroke('blue');
  // Set the noise level and scale.
  let noiseLevel = 300;
  let noiseScale = 0.002;

  // Iterate from left to right.
  for (let x = 0; x < width; x += 1) {
    // Scale the input coordinates.
    let nx = noiseScale * x;
    let nt = noiseScale * frameCount;

    // Compute the noise value.
    let y = noiseLevel * noise(nx, nt);

    // Draw the line.
    line(x, height, x, y+(height/3));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
