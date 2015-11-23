function is_touch_device() {
  return !!('ontouchstart' in window);
}

var w = 0;
var h = 0;
var lastUpdateX = 0;
var lastUpdateY = 0;
var canvas;
var $header, $canvas;
var offsetY;
var offsetX;

var GRID_UNIT = 28;
var GU = GRID_UNIT;

var markers = [];
var energies = [];
var EE;
var IE;
var center;

var cRed = "#FF3D00";
var cGreen = "#00E676";
var cIndigo = "#304FFE";
var cLightGrey = "#F2F2F2";

var img;

// SETUP

function setup() {

  EE = new EnergyEditor();
  IE = new ImageEditor();
  $header = $('.ForceField .stage');
  
  lastUpdateX = mouseX;
  lastUpdateY = mouseY;
  canvas = createCanvas();

  energies = [];

  $canvas = $(canvas.elt);
  $canvas.css({
    position: 'absolute',
    top: 0,
    left: 0,
    'z-index': 99
  });
  $header.append($canvas);
  

  $header.click(function(e) {
    var x = e.clientX;
    var y = e.clientY - 80;
    addEnergy(x, y);
  });

  $('.EditorImageInput').change(function() {
    var reader = new FileReader();
    reader.onload = function (e) {
      changeImage(e.target.result);
    }
    reader.readAsDataURL($(this).get(0).files[0]);
  });

  layoutGrid();
  testVectors();
  smooth();

  frameRate(1);
  canvas.drop(gotFile);
  
}

interact('.EditorImg img')
  .draggable({
    onmove: function(event) {
      var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  })
  .resizable({
    squareResize: true,
    edges: { left: true, right: true, top: true, bottom: true },
    invert: 'reposition',
    onmove: function (event) {
      console.log("asd");
      var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0);

      // update the element's style
      target.style.width  = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  });

function ImageEditor() {
  var $IE = $('.ImageEditor');
  var $strength = $IE.find('.EnergyEditor-strength');
  var $remove = $IE.find('a.delete');
  var $done = $IE.find('a.done');
  var $edit = $IE.find('a.edit');

  var self = this;

  $remove.click(function(e) {
    $header.find('.EditorImg').remove();
    $IE.removeClass('is-editing');
    $IE.removeClass('has-image');
  });

  $done.click(function(e) {
    $canvas.show();
    $IE.removeClass('is-editing');
  });

  $edit.click(function(e) {
    $canvas.hide();
    $IE.addClass('is-editing');
  });

  self.swapImage = function(dataUrl) {
    $header.find('.EditorImg').remove();
    var $img = $('<div class="EditorImg"><img src="' + dataUrl + '"></div>');
    $img.find('img').css('height', h);
    $header.append($img);
    $canvas.hide();
    $IE.addClass('has-image');
    $IE.addClass('is-editing');
  }
}

function changeImage(dataUrl) {
  IE.swapImage(dataUrl)
}

function gotFile(file) {
  if (file.type === 'image') {
    changeImage(file.data);
  }
}

function testVectors() {
  w = $header.width();
  h = $header.outerHeight();
  resizeCanvas(w, h);

  stroke("#FF0000");


}

function windowResized() {
  layoutGrid();
}

function layoutGrid() {
  
  w = $header.width();
  h = $header.outerHeight();

  resizeCanvas(w, h);
  var cols = ceil(w / GRID_UNIT);
  var rows = ceil(h / GRID_UNIT);
  offsetX = (w / 2) % GRID_UNIT;
  offsetY = 14;
  stroke("#FFFFFF");
  markers = [];
  
  for (var i=0; i < cols * rows; i++) {  
    markers.push(new GridMarker(createVector(i % cols * GRID_UNIT + offsetX, floor(i / cols) * GRID_UNIT + offsetY)));
    markers[i].draw();
  }
  //energies.push(new Energy(createVector(w / 2 + 200, 100)));
  //energies[0].setForce(1);
  //energies[0].setQuality(1);

  //addEnergy(w / 2 - 200, 100, 100);
  //addEnergy(w / 2 + 200, 100, 100);
  

  //energies.push(new Energy(createVector(w / 2 - 200, 350)));
  //energies[1].setForce(3);
  //energies[1].setQuality(1);
  ////
  //energies.push(new Energy(createVector(w / 2 + 200, 100)));
  //energies[2].setForce(1);
  //energies[2].setQuality(-1);
  ////
  //energies.push(new Energy(createVector(w / 2 + 100, 400)));
  //energies[3].setForce(1);
  //energies[3].setQuality(1);

  center = createVector(w / 2, h / 2);
  
  b();
}

function b() {
  if(!center) {
    return;
  }
  clear();

  if(img) {
    console.log(img);
    image(img, 0, 0, width, height);
  }

  for (var i=0; i < markers.length; i++) {
    markers[i].draw();
  }
  for (var i=0; i < energies.length; i++) {
    energies[i].draw();
  }


  push();
  translate(0, offsetY);
  push();
  translate(w / 2, h / 2);
  
  // circel
  noFill();
  stroke(cIndigo);
  strokeWeight(2);
  ellipseMode(CENTER);
  var r = sqrt(sq(GU) * 2) * 2;
  
  ellipse(0, 0, r, r);
  
  noStroke();
  
  // dots
  fill(cIndigo);
  var dotWidth = 6;
  ellipse(5 * GU, -5 * GU, dotWidth, dotWidth);
  ellipse(5 * GU, 5 * GU, dotWidth, dotWidth);
  ellipse(-5 * GU, 5 * GU, dotWidth, dotWidth);
  ellipse(-5 * GU, -5 * GU, dotWidth, dotWidth);
  
  // edges
  fill(cIndigo);
  var ew = 2;
  rect(8 * GU, -8 * GU  - ew / 2, GU / 2, ew);
  rect(8 * GU - ew / 2, -8 * GU - GU / 2, ew, GU / 2);
  
  rect(8 * GU, 8 * GU  - ew / 2, GU / 2, ew);
  rect(8 * GU - ew / 2, 8 * GU, ew, GU / 2);
  
  rect(-8 * GU, 8 * GU  - ew / 2, ew, GU / 2);
  rect(-8 * GU - GU / 2, 8 * GU  - ew / 2, GU / 2, ew);

  
  rect(-8 * GU, -8 * GU  - GU / 2, ew, GU / 2);
  rect(-8 * GU - GU / 2, -8 * GU  - ew / 2, GU / 2, ew);
  
  pop();

  pop();
}

function draw() {

  disableUpdateState();

  var d = dist(mouseX, mouseY, lastUpdateX, lastUpdateY);
  if(true) {
    var maxPPFactor = 0;
    var minPPFactor = w;
    for (var i=0; i < markers.length; i++) {
      markers[i].prepareUpdate();
      for (var j=0; j < energies.length; j++) {
        var e = energies[j];
        markers[i].update(e);
      }
      markers[i].finishUpdate();
      var pp = markers[i].getPPFactor();
      maxPPFactor = max(pp, maxPPFactor);
      minPPFactor = min(pp, minPPFactor);
    }

    for (var i=0; i < markers.length; i++) {
      markers[i].setPPOffest(minPPFactor, maxPPFactor);
    }
  } else {
    return;
  }
  
  b();
  
}