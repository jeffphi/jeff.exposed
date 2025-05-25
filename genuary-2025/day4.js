let music;
let maxB = 25;
let data = [];
let started = false;
let playing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 7; i++) {
    data.push({ b: random(0, maxB), dir: random(['up', 'down']) });
  }

  music = createAudio([
    'https://cdn.glitch.global/c13b8621-a374-4308-a5db-67e7952dd56b/08%20-%20Dio%20-%20Rainbow%20In%20The%20Dark.mp3?v=1735948488463'
  ]);
}

function mouseClicked() {
  if (!started) {
    started = true;
    music.loop();
    playing = true;
  } else{
    if(playing){
      music.pause();
      playing = false;
    } else{
      music.loop();
      playing = true;
    }
  }
}

function touchEnded(){
  mouseClicked();
}

function draw() {
  
  background('black');
  fill('white');
  textSize(20);
  textAlign(LEFT);
  text('Day 4: Black on black.', 20, 30);

  if (started) {
    colorMode(HSB);

    fill(color(0, 100, data[0].b));
    circle(windowWidth / 2, windowHeight, windowWidth);

    fill(color(39, 100, data[1].b));
    circle(windowWidth / 2, windowHeight, windowWidth - 100);

    fill(color(61, 100, data[2].b));
    circle(windowWidth / 2, windowHeight, windowWidth - 200);

    fill(color(133, 100, data[3].b));
    circle(windowWidth / 2, windowHeight, windowWidth - 300);

    fill(color(241, 100, data[4].b));
    circle(windowWidth / 2, windowHeight, windowWidth - 400);

    fill(color(259, 100, data[5].b));
    circle(windowWidth / 2, windowHeight, windowWidth - 500);

    fill(color(300, 100, data[6].b));
    circle(windowWidth / 2, windowHeight, windowWidth - 600);

    fill('black');
    circle(windowWidth / 2, windowHeight, windowWidth - 700);

    textSize(100);
    textAlign(CENTER);
    text('🤘', windowWidth / 2, windowHeight - 100);

    cycleBrightness();
  }
  else{
    textAlign(CENTER);
    text('Click Me (audio on)', windowWidth/2, windowHeight /2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function cycleBrightness() {
  for (let i = 0; i < data.length; i++) {
    if (data[i].dir == 'up') {
      data[i].b += 0.2;
      if (data[i].b > maxB) {
        data[i].b = maxB;
        data[i].dir = 'down';
      }
    } else if (data[i].dir == 'down') {
      data[i].b -= 0.2;
      if (data[i].b < 0) {
        data[i].b = 0;
        data[i].dir = 'up';
      }
    }
  }
}
