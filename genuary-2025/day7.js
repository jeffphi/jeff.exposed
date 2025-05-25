//console.log("\x1b[31m"+ "Red"); 
//console.log("\x1b[32m"+ "Green"); 
//console.log("\x1b[35m"+ "Magenta");
//console.log("\x1b[38;2;255;0;0m"+ "Other");
//let foo2 = "\x1b[38;2;255;0;0m"+ "Other2";
//console.log(foo2);

let images = [];
let frames = [];
let xScale = 28;
let yScale;

function preload() {

  
  images.push(loadImage('./assets/h1.png'));
  images.push(loadImage('./assets/h2.png'));
  images.push(loadImage('./assets/h3.png'));
  images.push(loadImage('./assets/h4.png'));
  images.push(loadImage('./assets/h5.png'));
  images.push(loadImage('./assets/h6.png'));
  images.push(loadImage('./assets/h7.png'));
  images.push(loadImage('./assets/h8.png'));
  images.push(loadImage('./assets/h9.png'));
  images.push(loadImage('./assets/h10.png'));
  images.push(loadImage('./assets/h11.png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < images.length; i++) {
    images[i].resize(xScale, 0);
    yScale = images[i].height;
    images[i].loadPixels();
    prepStrings(images[i].pixels);
  }
  //console.log("NumPix: "+img1.pixels.length+", width: "+img1.width+", height: "+img1.height);

  runAnimation();
  //dumpFrames();
  
}

function prepStrings(pixels) {
  /*
  Frames = [
  {rows:[]}
  ]

  r g b a   r g b a
  0 1 2 3   4 5 6 7

  8 9 10 11  12 13 14 15  row = 1, xScale = 2, yScale = 2

  */
  let tmpRows = [];
  let r;
  let g;
  let b;
  for (let row = 0; row < yScale; row++) {
    let tmpString = '';
    for (let col = 0; col < xScale * 4; col += 4) {
      r = pixels[(row * xScale * 4) + (col) + 0];
      g = pixels[(row * xScale * 4) + (col) + 1];
      b = pixels[(row * xScale * 4) + (col) + 2];
      tmpString = tmpString + "\x1b[38;2;" + r + ";" + g + ";" + b + "m" + " ▓  ";
    }
    tmpRows.push(tmpString);
  }
  frames.push({rows: tmpRows});
}

function dumpFrames(){
  drawFrame(frames[0]);
  console.log("frame");
  drawFrame(frames[1]);
  console.log("frame");
  drawFrame(frames[2]);
}

function runAnimation(){
  let delay = t => new Promise(resolve => setTimeout(resolve, t));
  // Console emulator doesn't seem to work if the very first call is clear.
  console.log();
  (async () => {
    for (i = 0; i < 60; i++) {
      for (let j = 0; j < frames.length; j++) {
        console.clear();
        drawFrame(frames[j]);
        await delay(250);
      }
    }
  })()
}

function draw() {
  background(220);
  stroke('black');
  textSize(20);
  text('Day 7: Use software that is not intended to create art or images.', 20, 30);

  text('Open your browser\'s developer console!', 100, 100);

  image(images[0], 0, 40);
  image(images[1], xScale+20, 40);
  image(images[2], 0, 60);
  image(images[3], xScale+20, 60);
  image(images[4], 0, 80);
  image(images[5], xScale+20, 80);
  image(images[6], 0, 100);
  image(images[7], xScale+20, 100);
  image(images[8], 0, 120);
  image(images[9], xScale+20, 120);
  image(images[10], 0, 140);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawFrame(frame) {
  for(let i = 0; i < frame.rows.length; i++){
    console.log(frame.rows[i]);
  }
}

function xdrawFrame(i) {
  console.clear();

  let bar = "\x1b[38;2;" + 255 + ";0;0m" + "▓" + "\x1b[38;2;" + 100 + ";" + 100 + ";0m" + "▓";
  let foo = "\x1b[38;2;" + 100 + ";" + 100 + ";0m" + "▓" + "\x1b[38;2;" + 255 + ";0;0m" + "▓";

  for (let i = 0; i < 50; i++) {
    bar += "\x1b[38;2;" + 255 + ";0;0m" + "▓" + "\x1b[38;2;" + 100 + ";" + 100 + ";0m" + "▓";
    foo += "\x1b[38;2;" + 100 + ";" + 100 + ";0m" + "▓" + "\x1b[38;2;" + 255 + ";0;0m" + "▓"
  }

  if (i % 2 == 0) {
    console.log(bar);
    console.log(foo);
    console.log(bar);
    console.log(foo);
    console.log(bar);
    console.log(bar);
    console.log(foo);
    console.log(bar);
    console.log(foo);
    console.log(bar);
  }
  else {
    console.log(foo);
    console.log(bar);
    console.log(foo);
    console.log(bar);
    console.log(bar);
    console.log(foo);
    console.log(bar);
    console.log(foo);
    console.log(bar);
    console.log(foo);
  }

}
