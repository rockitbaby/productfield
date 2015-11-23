var w = 400, h = 400;
var rotation = 0;
var density = window.devicePixelRatio; // happens to be 2 on os x with retina display

function setupJS() {
  // this sets up a canvas with the right number of pixels
  var cnv = createCanvas(w * density, h * density);
  // this shrinks the canvas to the correct size on screen
  cnv.style('width:'+(w)+'px;height:'+(h)+'px');
  rectMode(CENTER);
};

void draw() {
  // this scales everything to match the pixels size of the canvas
  scale(density, density);

  background(255);
  noFill();
  // here i'm using w and h instead of width and height
  // because the 'real' width and height of the sketch
  // are actually based on the density.
  translate(w/2, h/2);
  rotate(millis() / 1000);
  for(var i = 0; i < 20; i += 1) {
    rect(0, 0, 10*i, 10*i);
  }
};