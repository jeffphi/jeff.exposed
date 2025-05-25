let lines = [];

function setup() {
  createCanvas(displayWidth, displayHeight);

  // Allow 10px for a line
  for(let i = 0; i < width / 10; i++){
    let dir;
    let coin = random(1,3);
    if(random == 1){
      dir = "down";
    } else if(random == 2){
      dir = "up";
    } 

    lines.push({
      x1:i*10, y1:30, x2:i*10, y2:height, 
      w:random(1, 10),
      r:random(0, 256),
      g:random(0, 256),
      b:random(0, 256),
    }, );
  }
}

function draw() {
  background('white');
  frameRate(15);
  textSize(20);
  strokeWeight(1);
  stroke("black");
  text('Day 1: Vertical or horizontal lines only.', 10, 20);

  for(let i = 0; i < lines.length; i++){
    if(lines[i].dir == "up"){
      if(lines[i].w == 10){
        lines[i].w = 9;
        lines[i].dir = "down";
      } else{
        lines[i].w++;
      }
    } else{ // down
      if(lines[i].w <= 1){
        lines[i].w = 2;
        lines[i].dir = "up";
      } else{
        lines[i].w--;
      }
      
    }
    stroke(lines[i].r, lines[i].g, lines[i].b);
    strokeWeight(lines[i].w);
    console.log(lines[i].w);
    line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
  }
  
}