var video;
var scale = 0.25;
var gridSize = 24;
var cellSize = 0;
var intervalInMs = 300;

var gridDimension;
var front = true;
var constraints = { video: { facingMode: front ? "user" : "environment" } };

document.getElementById("flip-button").onclick = function () {
  front = !front;
  console.log("Flip. Front = " + front);
  init();
};

window.onload = init;

function init() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      var videoInputCount = 0;
      devices.forEach(function (device) {
        if (device.kind === "videoinput") {
          videoInputCount++;
        }
      });
      console.log("Video inputs:" + videoInputCount);
      //if(videoInputCount < 2){
      document.querySelector("#flip-button").style.display = "none";
      //}
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  var viewWidth = document.documentElement.clientWidth;
  var viewHeight = document.documentElement.clientHeight;

  //console.log("Viewport w,h: "+viewWidth+", "+viewHeight)

  if (viewWidth < viewHeight) {
    console.log("Portrait viewport");
    cellSize = viewWidth / gridSize;
    console.log("Cell size: " + cellSize);
  } else if (viewWidth > viewHeight) {
    console.log("Landscape viewport");
    cellSize = (viewHeight * 0.8) / gridSize;
    console.log("Cell size: " + cellSize);
  } else {
    console.log("Square viewport");
    cellSize = viewHeight / gridSize / 2;
    console.log("Cell size: " + cellSize);
  }

  video = document.querySelector("#videoElement");

  // Prefer camera resolution nearest to 1280x720.
  //var constraints = { audio: true, video: { width: 1280, height: 720 } };
  console.log("Constraints: " + constraints.video.facingMode);
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      //video.src = window.URL.createObjectURL(mediaStream);
      video.srcObject = mediaStream;
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  window.setInterval(captureImage, intervalInMs);
}

function captureImage() {
  var t0 = performance.now();

  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  var img = document.createElement("img");
  img.src = canvas.toDataURL();
  //$output.prepend(img);

  drawGrid(canvas);

  var t1 = performance.now();
  if (intervalInMs > (t1 - t0) * 5) {
    console.log(
      "Interval: " + intervalInMs + ", work took " + (t1 - t0) + "ms"
    );
    intervalInMs = intervalInMs - 5;
  }
}

function drawGrid(myCanvas) {
  var ctx = myCanvas.getContext("2d");
  var grid = document.querySelector("#grid");
  grid.style.width = cellSize * gridSize + "px";
  grid.style.height = cellSize * gridSize + "px";

  var ROWS = gridSize;
  var COLUMNS = ROWS;

  var cellWidthUnit = myCanvas.width / COLUMNS;
  var cellHeightUnit = myCanvas.height / ROWS;

  for (var row = 0; row < ROWS; row++) {
    for (var column = 0; column < COLUMNS; column++) {
      //create a div HTML element called cell
      var cell = document.createElement("div");

      //set its CSS class to cell
      cell.setAttribute("class", "cell");

      cell.style.width = cellSize + "px";
      cell.style.height = cellSize + "px";

      //add the div HTML element to the stage
      grid.appendChild(cell);

      //position the cell
      cell.style.top = row * cellSize + "px";
      cell.style.left = column * cellSize + "px";

      var rgb = getAverageRGB(
        myCanvas,
        cellWidthUnit * column,
        cellHeightUnit * row,
        cellWidthUnit,
        cellHeightUnit
      );

      cell.style.backgroundColor =
        "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    }
  }
}

function getAverageRGB(myCanvas, x, y, width, height) {
  var blockSize = 5, // only visit every 5 pixels
    context = myCanvas.getContext && myCanvas.getContext("2d"),
    defaultRGB = { r: 0, g: 0, b: 0 },
    data,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    console.log("Bad context!?");
  }
  
  //context.willReadFrequently = true;

  try {
    data = context.getImageData(x, y, width, height);
  } catch (e) {
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}
