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

interact('.energy')
.draggable({
  onstart: function (event) {
    var $target = $(event.target);
    $target.addClass('dragging');
  },
  onend: function (event) {
    console.log("sd");
    var $target = $(event.target);
    var energy = $target.data('energy');
    energy.setPos($target.data('x'), $target.data('y'));
    $target.removeClass('dragging');
    $target.addClass('updating');
  },
  onmove: function(event) {
    var $target = $(event.target),
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat($target.data('x')) || 0) + event.dx,
      y = (parseFloat($target.data('y')) || 0) + event.dy;

    $target.data('x', x);
    $target.data('y', y);
    $target.css({
      top: y,
      left: x
    });
  }
});

function disableUpdateState() {
  $('.energy').removeClass('updating');
}

function EnergyEditor() {
  var $EE = $('.EnergyEditor');
  var $strength = $EE.find('.EnergyEditor-strength');
  var $remove = $EE.find('a.delete');
  var $close = $EE.find('a.close');
  console.log($close);
  var self = this;
  var $activeEnergy = null;

  $remove.click(function(e) {
    if(!$activeEnergy) {
      return;
    }
    var energy = $activeEnergy.data('energy');
    var index = energies.indexOf(energy);
    if (index > -1) {
      energies.splice(index, 1);
    }
    $activeEnergy.remove();
    self.unsetActiveEngery();
  });

  $close.click(function(e) {
    if(!$activeEnergy) {
      return;
    }
    self.unsetActiveEngery();
  });

  $strength.change(function() {
    if(!$activeEnergy) {
      return;
    }
    var energy = $activeEnergy.data('energy');
    energy.setForce($('.EnergyEditor-strength').val());
    $activeEnergy.addClass('updating');
  });

  self.setActiveEnergy = function($elm) {
    if($activeEnergy) {
      $activeEnergy.removeClass('active');
    }
    $activeEnergy = $elm;
    $activeEnergy.addClass('active');
    var energy = $activeEnergy.data('energy');
    $strength.val(energy.getForce());
    $EE.addClass('active');
  }

  self.unsetActiveEngery = function() {
    $activeEnergy.removeClass('active');
    $activeEnergy = null;
    $EE.removeClass('active');
  }
}

function addEnergy(x, y) {

  var $elm = $('<div class="energy"></div>');

  $elm.css({
    top: y,
    left: x
  });
  $header.append($elm);
  var e = new Energy(createVector(x, y));

  $elm.data('energy', e);
  $elm.data('x', x);
  $elm.data('y', y);
  $elm.addClass('updating');

  
  $elm.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    EE.setActiveEnergy($elm);
  });

  energies.push(e);

  EE.setActiveEnergy($elm);

}

function Energy(_pos) {

  var self = this;
  var pos = _pos;
  var force = 1;

  // determine pull or push characteristics

  var fieldWidth = GU * 8;
  var d = min(max(w / 2 - pos.x, -fieldWidth), fieldWidth) / fieldWidth;

  self.getQuality = function(q) {
   return force;
  }
  self.getForce = function() {
   return force;
  }
  self.setForce = function(f) {
   force = f;
  }
  self.setPos = function(x, y) {
    pos = createVector(x, y);
    d = min(max(w / 2 - pos.x, -fieldWidth), fieldWidth) / fieldWidth;
  }
  self.getPos = function() {
   return pos;
  }
  self.draw = function() {
    fill("#FFFFFF");
    noStroke();
    ellipse(pos.x, pos.y, 18, 18);
    var c = "#000000";
    if(force > 0) {
      c = cGreen;
    } else if (force < 0) {
      c = cRed;
    }
    fill(c);
    ellipse(pos.x, pos.y, 6, 6);
    noFill();
    stroke(c);
    ellipse(pos.x, pos.y, 20 + 2, 20 + 2);
    if(abs(force) > 1) {
      ellipse(pos.x, pos.y, 20 + 8, 20 + 8);
    }
    if(abs(force) > 2) {
      ellipse(pos.x, pos.y, 20 + 14, 20 + 14);
    }

    fill(c);
    textAlign(CENTER);
    //text(force, self.pos.x, self.pos.y + 9 / 2);
  }
  self.d = function() {
    return d;
  }
  self.isPull = function() {
    return (d < 0);
  }
  self.isPush = function() {
    return (d > 0);
  }


}
function pullArrow(x1, y1, x2, y2, len) {
  line(x1, y1, x2, y2);
  //len = 5;
  push();
  translate(x2, y2);
  var a = atan2(x1-x2, y2-y1);
  rotate(a);
  noStroke();
  translate(0, len);
  triangle(len, -len, -len, -len, 0, 0)
  pop();
}

function pushArrow(x1, y1, x2, y2, len) {
  line(x1, y1, x2, y2);
  //len = 5;
  push();
  translate(x1, y1);
  var a = atan2(x1-x2, y2-y1);
  rotate(a);
  noStroke();
  triangle(len, -len, -len, -len, 0, 0)
  pop();
}

function GridMarker(pos) {

  var self = this;
  //self.originalPos = pos.copy();
  self.pos = pos;
  self.dir = createVector(0, 0);
  self.offset = createVector(0, 0);
  self.starta = createVector(0, 0);
  self.enda = createVector(0, 0);
  
  var n = 0;
  var ppFactorSum = 0;
  var ppFactor = 0;
  var totalD = 0;
  var ppValues = [];

  function draw() {
    push();
    
    // draw dot
    noStroke();
    fill(cIndigo);
    ellipse(self.pos.x, self.pos.y, 2, 2);
    
    var len = 5;
    var sw = 2;

    if(self.dir.mag() < 2) {
      return;
    }
    if(self.dir.mag() < 4) {
      len = 4;
      sw = 2;
      //return;
    }
    if(self.dir.mag() < 3) {
      len = 3;
      sw = 1;
    }
    // draw arrow
    noFill();
    strokeWeight(sw);
    var c = cIndigo;
    
    if(self.dir.x > 0) {
      // positive force
    } else {
      c = cRed;
    }
    fill(c);
    stroke(c);
    if(self.dir.x > 0 && ppFactor > 0 || self.dir.x < 0 && ppFactor < 0 ) {
      // arrow at end
      pullArrow(self.starta.x, self.starta.y, self.enda.x, self.enda.y, len);
    } else {
      // arrow at start
      pushArrow(self.starta.x, self.starta.y, self.enda.x, self.enda.y, len); 
    }
    
    if(self.dir.mag() > 6) {
    // draw push, pull balance
    noFill();
    push();
    translate(self.pos.x, self.pos.y);
    var a = self.dir.heading() - 1 / 2 * PI;
    rotate(a);
    strokeWeight(1);
    stroke(c);
    var l = 3;
    line(-l, 0, l, 0);
    pop();
    }
    
    pop();
  }


  function prepareUpdate() {
    self.dir = createVector(0, 0);
    n = 0;
    ppFactorSum = 0;
    ppFactor = 0;
    ppValues = [];
    totalD = 0;
  }

  function update(energy) {

    if(energy.getForce() == 0) {
      return;
    }
    var toForce = p5.Vector.sub(center, energy.getPos());
    var distanceToForce = pos.dist(energy.getPos());
    //var distanceToCenter = pos.dist(p5.Vector.lerp(center, energy.getPos(), 0.8));

    ppValues.push([energy.d(), distanceToForce]);
    totalD += distanceToForce;

    toForce.normalize();
    toForce.x = 1 * w * energy.getForce();
    toForce.y = toForce.y  * w * energy.getForce();

    if(energy.isPull()) {
      toForce.y = toForce.y * -1
      if(energy.getQuality() < 0) {
        toForce.y = toForce.y * 1
      }
    } else {
      if(energy.getQuality() < 0) {
        toForce.y = toForce.y * 1
      }
    }
    
    toForce.x = toForce.x * 1 / distanceToForce;
    toForce.y = toForce.y * 1 / distanceToForce;

    self.dir.add(toForce);


    
  }

  function finishUpdate() {

    ppFactor = 0;
    ppValues.forEach(function(t) {
      ppFactor += t[0] * t[1] / totalD;
    });

    // dirty fix if there is just one energy source.
    if(ppValues.length == 1) {
      ppFactor = -ppValues[0][0];
    }

    // scaledPPFactor 1: pull - - - - -  0: push
    self.dir.limit(GU);

    var scaledPPFactor = map(ppFactor, -1, 1, 0, 1);
    self.offset = p5.Vector.mult(self.dir, -scaledPPFactor);

    self.starta = p5.Vector.add(self.pos, self.offset);
    self.enda = p5.Vector.add(self.pos, self.offset);
    self.enda.add(self.dir);

    
  }

  self.setPPOffest = function(minPP, maxPP) {
    return;
    var scaledPPFactor = map(ppFactor, minPP, maxPP, 0, 1);

    // scaledPPFactor 1: pull - - - - -  0: push

    scaledPPFactor = map(ppFactor, -1, 1, 0, 1);
    self.offset = p5.Vector.mult(self.dir, -scaledPPFactor);

    self.starta = p5.Vector.add(self.pos, self.offset);
    self.enda = p5.Vector.add(self.pos, self.offset);
    self.enda.add(self.dir);
  }

  self.getPPFactor = function() {
    return ppFactor;
  }

  self.draw = draw;
  self.prepareUpdate = prepareUpdate;
  self.finishUpdate = finishUpdate;
  self.update = update;

}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcmNlZmllbGQuanMiLCJlbmVyZ3kuanMiLCJncmlkbWFya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImZvcmNlZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBpc190b3VjaF9kZXZpY2UoKSB7XG4gIHJldHVybiAhISgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpO1xufVxuXG52YXIgdyA9IDA7XG52YXIgaCA9IDA7XG52YXIgbGFzdFVwZGF0ZVggPSAwO1xudmFyIGxhc3RVcGRhdGVZID0gMDtcbnZhciBjYW52YXM7XG52YXIgJGhlYWRlciwgJGNhbnZhcztcbnZhciBvZmZzZXRZO1xudmFyIG9mZnNldFg7XG5cbnZhciBHUklEX1VOSVQgPSAyODtcbnZhciBHVSA9IEdSSURfVU5JVDtcblxudmFyIG1hcmtlcnMgPSBbXTtcbnZhciBlbmVyZ2llcyA9IFtdO1xudmFyIEVFO1xudmFyIElFO1xudmFyIGNlbnRlcjtcblxudmFyIGNSZWQgPSBcIiNGRjNEMDBcIjtcbnZhciBjR3JlZW4gPSBcIiMwMEU2NzZcIjtcbnZhciBjSW5kaWdvID0gXCIjMzA0RkZFXCI7XG52YXIgY0xpZ2h0R3JleSA9IFwiI0YyRjJGMlwiO1xuXG52YXIgaW1nO1xuXG4vLyBTRVRVUFxuXG5mdW5jdGlvbiBzZXR1cCgpIHtcblxuICBFRSA9IG5ldyBFbmVyZ3lFZGl0b3IoKTtcbiAgSUUgPSBuZXcgSW1hZ2VFZGl0b3IoKTtcbiAgJGhlYWRlciA9ICQoJy5Gb3JjZUZpZWxkIC5zdGFnZScpO1xuICBcbiAgbGFzdFVwZGF0ZVggPSBtb3VzZVg7XG4gIGxhc3RVcGRhdGVZID0gbW91c2VZO1xuICBjYW52YXMgPSBjcmVhdGVDYW52YXMoKTtcblxuICBlbmVyZ2llcyA9IFtdO1xuXG4gICRjYW52YXMgPSAkKGNhbnZhcy5lbHQpO1xuICAkY2FudmFzLmNzcyh7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgJ3otaW5kZXgnOiA5OVxuICB9KTtcbiAgJGhlYWRlci5hcHBlbmQoJGNhbnZhcyk7XG4gIFxuXG4gICRoZWFkZXIuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIHZhciB4ID0gZS5jbGllbnRYO1xuICAgIHZhciB5ID0gZS5jbGllbnRZIC0gODA7XG4gICAgYWRkRW5lcmd5KHgsIHkpO1xuICB9KTtcblxuICAkKCcuRWRpdG9ySW1hZ2VJbnB1dCcpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNoYW5nZUltYWdlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgfVxuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKCQodGhpcykuZ2V0KDApLmZpbGVzWzBdKTtcbiAgfSk7XG5cbiAgbGF5b3V0R3JpZCgpO1xuICB0ZXN0VmVjdG9ycygpO1xuICBzbW9vdGgoKTtcblxuICBmcmFtZVJhdGUoMSk7XG4gIGNhbnZhcy5kcm9wKGdvdEZpbGUpO1xuICBcbn1cblxuaW50ZXJhY3QoJy5FZGl0b3JJbWcgaW1nJylcbiAgLmRyYWdnYWJsZSh7XG4gICAgb25tb3ZlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldCxcbiAgICAgIC8vIGtlZXAgdGhlIGRyYWdnZWQgcG9zaXRpb24gaW4gdGhlIGRhdGEteC9kYXRhLXkgYXR0cmlidXRlc1xuICAgICAgeCA9IChwYXJzZUZsb2F0KHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpKSB8fCAwKSArIGV2ZW50LmR4LFxuICAgICAgeSA9IChwYXJzZUZsb2F0KHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEteScpKSB8fCAwKSArIGV2ZW50LmR5O1xuXG4gICAgICAvLyB0cmFuc2xhdGUgdGhlIGVsZW1lbnRcbiAgICAgIHRhcmdldC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPVxuICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICd0cmFuc2xhdGUoJyArIHggKyAncHgsICcgKyB5ICsgJ3B4KSc7XG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgcG9zaWlvbiBhdHRyaWJ1dGVzXG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLXgnLCB4KTtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIHkpO1xuICAgIH1cbiAgfSlcbiAgLnJlc2l6YWJsZSh7XG4gICAgc3F1YXJlUmVzaXplOiB0cnVlLFxuICAgIGVkZ2VzOiB7IGxlZnQ6IHRydWUsIHJpZ2h0OiB0cnVlLCB0b3A6IHRydWUsIGJvdHRvbTogdHJ1ZSB9LFxuICAgIGludmVydDogJ3JlcG9zaXRpb24nLFxuICAgIG9ubW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBjb25zb2xlLmxvZyhcImFzZFwiKTtcbiAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQsXG4gICAgICAgICAgeCA9IChwYXJzZUZsb2F0KHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEteCcpKSB8fCAwKSxcbiAgICAgICAgICB5ID0gKHBhcnNlRmxvYXQodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS15JykpIHx8IDApO1xuXG4gICAgICAvLyB1cGRhdGUgdGhlIGVsZW1lbnQncyBzdHlsZVxuICAgICAgdGFyZ2V0LnN0eWxlLndpZHRoICA9IGV2ZW50LnJlY3Qud2lkdGggKyAncHgnO1xuICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9IGV2ZW50LnJlY3QuaGVpZ2h0ICsgJ3B4JztcblxuICAgICAgLy8gdHJhbnNsYXRlIHdoZW4gcmVzaXppbmcgZnJvbSB0b3Agb3IgbGVmdCBlZGdlc1xuICAgICAgeCArPSBldmVudC5kZWx0YVJlY3QubGVmdDtcbiAgICAgIHkgKz0gZXZlbnQuZGVsdGFSZWN0LnRvcDtcblxuICAgICAgdGFyZ2V0LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICd0cmFuc2xhdGUoJyArIHggKyAncHgsJyArIHkgKyAncHgpJztcblxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS14JywgeCk7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLXknLCB5KTtcbiAgICB9XG4gIH0pO1xuXG5mdW5jdGlvbiBJbWFnZUVkaXRvcigpIHtcbiAgdmFyICRJRSA9ICQoJy5JbWFnZUVkaXRvcicpO1xuICB2YXIgJHN0cmVuZ3RoID0gJElFLmZpbmQoJy5FbmVyZ3lFZGl0b3Itc3RyZW5ndGgnKTtcbiAgdmFyICRyZW1vdmUgPSAkSUUuZmluZCgnYS5kZWxldGUnKTtcbiAgdmFyICRkb25lID0gJElFLmZpbmQoJ2EuZG9uZScpO1xuICB2YXIgJGVkaXQgPSAkSUUuZmluZCgnYS5lZGl0Jyk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICRyZW1vdmUuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICRoZWFkZXIuZmluZCgnLkVkaXRvckltZycpLnJlbW92ZSgpO1xuICAgICRJRS5yZW1vdmVDbGFzcygnaXMtZWRpdGluZycpO1xuICAgICRJRS5yZW1vdmVDbGFzcygnaGFzLWltYWdlJyk7XG4gIH0pO1xuXG4gICRkb25lLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAkY2FudmFzLnNob3coKTtcbiAgICAkSUUucmVtb3ZlQ2xhc3MoJ2lzLWVkaXRpbmcnKTtcbiAgfSk7XG5cbiAgJGVkaXQuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICRjYW52YXMuaGlkZSgpO1xuICAgICRJRS5hZGRDbGFzcygnaXMtZWRpdGluZycpO1xuICB9KTtcblxuICBzZWxmLnN3YXBJbWFnZSA9IGZ1bmN0aW9uKGRhdGFVcmwpIHtcbiAgICAkaGVhZGVyLmZpbmQoJy5FZGl0b3JJbWcnKS5yZW1vdmUoKTtcbiAgICB2YXIgJGltZyA9ICQoJzxkaXYgY2xhc3M9XCJFZGl0b3JJbWdcIj48aW1nIHNyYz1cIicgKyBkYXRhVXJsICsgJ1wiPjwvZGl2PicpO1xuICAgICRpbWcuZmluZCgnaW1nJykuY3NzKCdoZWlnaHQnLCBoKTtcbiAgICAkaGVhZGVyLmFwcGVuZCgkaW1nKTtcbiAgICAkY2FudmFzLmhpZGUoKTtcbiAgICAkSUUuYWRkQ2xhc3MoJ2hhcy1pbWFnZScpO1xuICAgICRJRS5hZGRDbGFzcygnaXMtZWRpdGluZycpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoYW5nZUltYWdlKGRhdGFVcmwpIHtcbiAgSUUuc3dhcEltYWdlKGRhdGFVcmwpXG59XG5cbmZ1bmN0aW9uIGdvdEZpbGUoZmlsZSkge1xuICBpZiAoZmlsZS50eXBlID09PSAnaW1hZ2UnKSB7XG4gICAgY2hhbmdlSW1hZ2UoZmlsZS5kYXRhKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXN0VmVjdG9ycygpIHtcbiAgdyA9ICRoZWFkZXIud2lkdGgoKTtcbiAgaCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcbiAgcmVzaXplQ2FudmFzKHcsIGgpO1xuXG4gIHN0cm9rZShcIiNGRjAwMDBcIik7XG5cblxufVxuXG5mdW5jdGlvbiB3aW5kb3dSZXNpemVkKCkge1xuICBsYXlvdXRHcmlkKCk7XG59XG5cbmZ1bmN0aW9uIGxheW91dEdyaWQoKSB7XG4gIFxuICB3ID0gJGhlYWRlci53aWR0aCgpO1xuICBoID0gJGhlYWRlci5vdXRlckhlaWdodCgpO1xuXG4gIHJlc2l6ZUNhbnZhcyh3LCBoKTtcbiAgdmFyIGNvbHMgPSBjZWlsKHcgLyBHUklEX1VOSVQpO1xuICB2YXIgcm93cyA9IGNlaWwoaCAvIEdSSURfVU5JVCk7XG4gIG9mZnNldFggPSAodyAvIDIpICUgR1JJRF9VTklUO1xuICBvZmZzZXRZID0gMTQ7XG4gIHN0cm9rZShcIiNGRkZGRkZcIik7XG4gIG1hcmtlcnMgPSBbXTtcbiAgXG4gIGZvciAodmFyIGk9MDsgaSA8IGNvbHMgKiByb3dzOyBpKyspIHsgIFxuICAgIG1hcmtlcnMucHVzaChuZXcgR3JpZE1hcmtlcihjcmVhdGVWZWN0b3IoaSAlIGNvbHMgKiBHUklEX1VOSVQgKyBvZmZzZXRYLCBmbG9vcihpIC8gY29scykgKiBHUklEX1VOSVQgKyBvZmZzZXRZKSkpO1xuICAgIG1hcmtlcnNbaV0uZHJhdygpO1xuICB9XG4gIC8vZW5lcmdpZXMucHVzaChuZXcgRW5lcmd5KGNyZWF0ZVZlY3Rvcih3IC8gMiArIDIwMCwgMTAwKSkpO1xuICAvL2VuZXJnaWVzWzBdLnNldEZvcmNlKDEpO1xuICAvL2VuZXJnaWVzWzBdLnNldFF1YWxpdHkoMSk7XG5cbiAgLy9hZGRFbmVyZ3kodyAvIDIgLSAyMDAsIDEwMCwgMTAwKTtcbiAgLy9hZGRFbmVyZ3kodyAvIDIgKyAyMDAsIDEwMCwgMTAwKTtcbiAgXG5cbiAgLy9lbmVyZ2llcy5wdXNoKG5ldyBFbmVyZ3koY3JlYXRlVmVjdG9yKHcgLyAyIC0gMjAwLCAzNTApKSk7XG4gIC8vZW5lcmdpZXNbMV0uc2V0Rm9yY2UoMyk7XG4gIC8vZW5lcmdpZXNbMV0uc2V0UXVhbGl0eSgxKTtcbiAgLy8vL1xuICAvL2VuZXJnaWVzLnB1c2gobmV3IEVuZXJneShjcmVhdGVWZWN0b3IodyAvIDIgKyAyMDAsIDEwMCkpKTtcbiAgLy9lbmVyZ2llc1syXS5zZXRGb3JjZSgxKTtcbiAgLy9lbmVyZ2llc1syXS5zZXRRdWFsaXR5KC0xKTtcbiAgLy8vL1xuICAvL2VuZXJnaWVzLnB1c2gobmV3IEVuZXJneShjcmVhdGVWZWN0b3IodyAvIDIgKyAxMDAsIDQwMCkpKTtcbiAgLy9lbmVyZ2llc1szXS5zZXRGb3JjZSgxKTtcbiAgLy9lbmVyZ2llc1szXS5zZXRRdWFsaXR5KDEpO1xuXG4gIGNlbnRlciA9IGNyZWF0ZVZlY3Rvcih3IC8gMiwgaCAvIDIpO1xuICBcbiAgYigpO1xufVxuXG5mdW5jdGlvbiBiKCkge1xuICBpZighY2VudGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNsZWFyKCk7XG5cbiAgaWYoaW1nKSB7XG4gICAgY29uc29sZS5sb2coaW1nKTtcbiAgICBpbWFnZShpbWcsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgZm9yICh2YXIgaT0wOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgIG1hcmtlcnNbaV0uZHJhdygpO1xuICB9XG4gIGZvciAodmFyIGk9MDsgaSA8IGVuZXJnaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZW5lcmdpZXNbaV0uZHJhdygpO1xuICB9XG5cblxuICBwdXNoKCk7XG4gIHRyYW5zbGF0ZSgwLCBvZmZzZXRZKTtcbiAgcHVzaCgpO1xuICB0cmFuc2xhdGUodyAvIDIsIGggLyAyKTtcbiAgXG4gIC8vIGNpcmNlbFxuICBub0ZpbGwoKTtcbiAgc3Ryb2tlKGNJbmRpZ28pO1xuICBzdHJva2VXZWlnaHQoMik7XG4gIGVsbGlwc2VNb2RlKENFTlRFUik7XG4gIHZhciByID0gc3FydChzcShHVSkgKiAyKSAqIDI7XG4gIFxuICBlbGxpcHNlKDAsIDAsIHIsIHIpO1xuICBcbiAgbm9TdHJva2UoKTtcbiAgXG4gIC8vIGRvdHNcbiAgZmlsbChjSW5kaWdvKTtcbiAgdmFyIGRvdFdpZHRoID0gNjtcbiAgZWxsaXBzZSg1ICogR1UsIC01ICogR1UsIGRvdFdpZHRoLCBkb3RXaWR0aCk7XG4gIGVsbGlwc2UoNSAqIEdVLCA1ICogR1UsIGRvdFdpZHRoLCBkb3RXaWR0aCk7XG4gIGVsbGlwc2UoLTUgKiBHVSwgNSAqIEdVLCBkb3RXaWR0aCwgZG90V2lkdGgpO1xuICBlbGxpcHNlKC01ICogR1UsIC01ICogR1UsIGRvdFdpZHRoLCBkb3RXaWR0aCk7XG4gIFxuICAvLyBlZGdlc1xuICBmaWxsKGNJbmRpZ28pO1xuICB2YXIgZXcgPSAyO1xuICByZWN0KDggKiBHVSwgLTggKiBHVSAgLSBldyAvIDIsIEdVIC8gMiwgZXcpO1xuICByZWN0KDggKiBHVSAtIGV3IC8gMiwgLTggKiBHVSAtIEdVIC8gMiwgZXcsIEdVIC8gMik7XG4gIFxuICByZWN0KDggKiBHVSwgOCAqIEdVICAtIGV3IC8gMiwgR1UgLyAyLCBldyk7XG4gIHJlY3QoOCAqIEdVIC0gZXcgLyAyLCA4ICogR1UsIGV3LCBHVSAvIDIpO1xuICBcbiAgcmVjdCgtOCAqIEdVLCA4ICogR1UgIC0gZXcgLyAyLCBldywgR1UgLyAyKTtcbiAgcmVjdCgtOCAqIEdVIC0gR1UgLyAyLCA4ICogR1UgIC0gZXcgLyAyLCBHVSAvIDIsIGV3KTtcblxuICBcbiAgcmVjdCgtOCAqIEdVLCAtOCAqIEdVICAtIEdVIC8gMiwgZXcsIEdVIC8gMik7XG4gIHJlY3QoLTggKiBHVSAtIEdVIC8gMiwgLTggKiBHVSAgLSBldyAvIDIsIEdVIC8gMiwgZXcpO1xuICBcbiAgcG9wKCk7XG5cbiAgcG9wKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG5cbiAgZGlzYWJsZVVwZGF0ZVN0YXRlKCk7XG5cbiAgdmFyIGQgPSBkaXN0KG1vdXNlWCwgbW91c2VZLCBsYXN0VXBkYXRlWCwgbGFzdFVwZGF0ZVkpO1xuICBpZih0cnVlKSB7XG4gICAgdmFyIG1heFBQRmFjdG9yID0gMDtcbiAgICB2YXIgbWluUFBGYWN0b3IgPSB3O1xuICAgIGZvciAodmFyIGk9MDsgaSA8IG1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG1hcmtlcnNbaV0ucHJlcGFyZVVwZGF0ZSgpO1xuICAgICAgZm9yICh2YXIgaj0wOyBqIDwgZW5lcmdpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdmFyIGUgPSBlbmVyZ2llc1tqXTtcbiAgICAgICAgbWFya2Vyc1tpXS51cGRhdGUoZSk7XG4gICAgICB9XG4gICAgICBtYXJrZXJzW2ldLmZpbmlzaFVwZGF0ZSgpO1xuICAgICAgdmFyIHBwID0gbWFya2Vyc1tpXS5nZXRQUEZhY3RvcigpO1xuICAgICAgbWF4UFBGYWN0b3IgPSBtYXgocHAsIG1heFBQRmFjdG9yKTtcbiAgICAgIG1pblBQRmFjdG9yID0gbWluKHBwLCBtaW5QUEZhY3Rvcik7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaT0wOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgbWFya2Vyc1tpXS5zZXRQUE9mZmVzdChtaW5QUEZhY3RvciwgbWF4UFBGYWN0b3IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGIoKTtcbiAgXG59IiwiXG5pbnRlcmFjdCgnLmVuZXJneScpXG4uZHJhZ2dhYmxlKHtcbiAgb25zdGFydDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG4gICAgJHRhcmdldC5hZGRDbGFzcygnZHJhZ2dpbmcnKTtcbiAgfSxcbiAgb25lbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnNvbGUubG9nKFwic2RcIik7XG4gICAgdmFyICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG4gICAgdmFyIGVuZXJneSA9ICR0YXJnZXQuZGF0YSgnZW5lcmd5Jyk7XG4gICAgZW5lcmd5LnNldFBvcygkdGFyZ2V0LmRhdGEoJ3gnKSwgJHRhcmdldC5kYXRhKCd5JykpO1xuICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ2RyYWdnaW5nJyk7XG4gICAgJHRhcmdldC5hZGRDbGFzcygndXBkYXRpbmcnKTtcbiAgfSxcbiAgb25tb3ZlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpLFxuICAgICAgLy8ga2VlcCB0aGUgZHJhZ2dlZCBwb3NpdGlvbiBpbiB0aGUgZGF0YS14L2RhdGEteSBhdHRyaWJ1dGVzXG4gICAgICB4ID0gKHBhcnNlRmxvYXQoJHRhcmdldC5kYXRhKCd4JykpIHx8IDApICsgZXZlbnQuZHgsXG4gICAgICB5ID0gKHBhcnNlRmxvYXQoJHRhcmdldC5kYXRhKCd5JykpIHx8IDApICsgZXZlbnQuZHk7XG5cbiAgICAkdGFyZ2V0LmRhdGEoJ3gnLCB4KTtcbiAgICAkdGFyZ2V0LmRhdGEoJ3knLCB5KTtcbiAgICAkdGFyZ2V0LmNzcyh7XG4gICAgICB0b3A6IHksXG4gICAgICBsZWZ0OiB4XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBkaXNhYmxlVXBkYXRlU3RhdGUoKSB7XG4gICQoJy5lbmVyZ3knKS5yZW1vdmVDbGFzcygndXBkYXRpbmcnKTtcbn1cblxuZnVuY3Rpb24gRW5lcmd5RWRpdG9yKCkge1xuICB2YXIgJEVFID0gJCgnLkVuZXJneUVkaXRvcicpO1xuICB2YXIgJHN0cmVuZ3RoID0gJEVFLmZpbmQoJy5FbmVyZ3lFZGl0b3Itc3RyZW5ndGgnKTtcbiAgdmFyICRyZW1vdmUgPSAkRUUuZmluZCgnYS5kZWxldGUnKTtcbiAgdmFyICRjbG9zZSA9ICRFRS5maW5kKCdhLmNsb3NlJyk7XG4gIGNvbnNvbGUubG9nKCRjbG9zZSk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyICRhY3RpdmVFbmVyZ3kgPSBudWxsO1xuXG4gICRyZW1vdmUuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGlmKCEkYWN0aXZlRW5lcmd5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbmVyZ3kgPSAkYWN0aXZlRW5lcmd5LmRhdGEoJ2VuZXJneScpO1xuICAgIHZhciBpbmRleCA9IGVuZXJnaWVzLmluZGV4T2YoZW5lcmd5KTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgZW5lcmdpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgJGFjdGl2ZUVuZXJneS5yZW1vdmUoKTtcbiAgICBzZWxmLnVuc2V0QWN0aXZlRW5nZXJ5KCk7XG4gIH0pO1xuXG4gICRjbG9zZS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgaWYoISRhY3RpdmVFbmVyZ3kpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZi51bnNldEFjdGl2ZUVuZ2VyeSgpO1xuICB9KTtcblxuICAkc3RyZW5ndGguY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgIGlmKCEkYWN0aXZlRW5lcmd5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbmVyZ3kgPSAkYWN0aXZlRW5lcmd5LmRhdGEoJ2VuZXJneScpO1xuICAgIGVuZXJneS5zZXRGb3JjZSgkKCcuRW5lcmd5RWRpdG9yLXN0cmVuZ3RoJykudmFsKCkpO1xuICAgICRhY3RpdmVFbmVyZ3kuYWRkQ2xhc3MoJ3VwZGF0aW5nJyk7XG4gIH0pO1xuXG4gIHNlbGYuc2V0QWN0aXZlRW5lcmd5ID0gZnVuY3Rpb24oJGVsbSkge1xuICAgIGlmKCRhY3RpdmVFbmVyZ3kpIHtcbiAgICAgICRhY3RpdmVFbmVyZ3kucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICAkYWN0aXZlRW5lcmd5ID0gJGVsbTtcbiAgICAkYWN0aXZlRW5lcmd5LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB2YXIgZW5lcmd5ID0gJGFjdGl2ZUVuZXJneS5kYXRhKCdlbmVyZ3knKTtcbiAgICAkc3RyZW5ndGgudmFsKGVuZXJneS5nZXRGb3JjZSgpKTtcbiAgICAkRUUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgc2VsZi51bnNldEFjdGl2ZUVuZ2VyeSA9IGZ1bmN0aW9uKCkge1xuICAgICRhY3RpdmVFbmVyZ3kucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICRhY3RpdmVFbmVyZ3kgPSBudWxsO1xuICAgICRFRS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRW5lcmd5KHgsIHkpIHtcblxuICB2YXIgJGVsbSA9ICQoJzxkaXYgY2xhc3M9XCJlbmVyZ3lcIj48L2Rpdj4nKTtcblxuICAkZWxtLmNzcyh7XG4gICAgdG9wOiB5LFxuICAgIGxlZnQ6IHhcbiAgfSk7XG4gICRoZWFkZXIuYXBwZW5kKCRlbG0pO1xuICB2YXIgZSA9IG5ldyBFbmVyZ3koY3JlYXRlVmVjdG9yKHgsIHkpKTtcblxuICAkZWxtLmRhdGEoJ2VuZXJneScsIGUpO1xuICAkZWxtLmRhdGEoJ3gnLCB4KTtcbiAgJGVsbS5kYXRhKCd5JywgeSk7XG4gICRlbG0uYWRkQ2xhc3MoJ3VwZGF0aW5nJyk7XG5cbiAgXG4gICRlbG0uY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIEVFLnNldEFjdGl2ZUVuZXJneSgkZWxtKTtcbiAgfSk7XG5cbiAgZW5lcmdpZXMucHVzaChlKTtcblxuICBFRS5zZXRBY3RpdmVFbmVyZ3koJGVsbSk7XG5cbn1cblxuZnVuY3Rpb24gRW5lcmd5KF9wb3MpIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBwb3MgPSBfcG9zO1xuICB2YXIgZm9yY2UgPSAxO1xuXG4gIC8vIGRldGVybWluZSBwdWxsIG9yIHB1c2ggY2hhcmFjdGVyaXN0aWNzXG5cbiAgdmFyIGZpZWxkV2lkdGggPSBHVSAqIDg7XG4gIHZhciBkID0gbWluKG1heCh3IC8gMiAtIHBvcy54LCAtZmllbGRXaWR0aCksIGZpZWxkV2lkdGgpIC8gZmllbGRXaWR0aDtcblxuICBzZWxmLmdldFF1YWxpdHkgPSBmdW5jdGlvbihxKSB7XG4gICByZXR1cm4gZm9yY2U7XG4gIH1cbiAgc2VsZi5nZXRGb3JjZSA9IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIGZvcmNlO1xuICB9XG4gIHNlbGYuc2V0Rm9yY2UgPSBmdW5jdGlvbihmKSB7XG4gICBmb3JjZSA9IGY7XG4gIH1cbiAgc2VsZi5zZXRQb3MgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgcG9zID0gY3JlYXRlVmVjdG9yKHgsIHkpO1xuICAgIGQgPSBtaW4obWF4KHcgLyAyIC0gcG9zLngsIC1maWVsZFdpZHRoKSwgZmllbGRXaWR0aCkgLyBmaWVsZFdpZHRoO1xuICB9XG4gIHNlbGYuZ2V0UG9zID0gZnVuY3Rpb24oKSB7XG4gICByZXR1cm4gcG9zO1xuICB9XG4gIHNlbGYuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGZpbGwoXCIjRkZGRkZGXCIpO1xuICAgIG5vU3Ryb2tlKCk7XG4gICAgZWxsaXBzZShwb3MueCwgcG9zLnksIDE4LCAxOCk7XG4gICAgdmFyIGMgPSBcIiMwMDAwMDBcIjtcbiAgICBpZihmb3JjZSA+IDApIHtcbiAgICAgIGMgPSBjR3JlZW47XG4gICAgfSBlbHNlIGlmIChmb3JjZSA8IDApIHtcbiAgICAgIGMgPSBjUmVkO1xuICAgIH1cbiAgICBmaWxsKGMpO1xuICAgIGVsbGlwc2UocG9zLngsIHBvcy55LCA2LCA2KTtcbiAgICBub0ZpbGwoKTtcbiAgICBzdHJva2UoYyk7XG4gICAgZWxsaXBzZShwb3MueCwgcG9zLnksIDIwICsgMiwgMjAgKyAyKTtcbiAgICBpZihhYnMoZm9yY2UpID4gMSkge1xuICAgICAgZWxsaXBzZShwb3MueCwgcG9zLnksIDIwICsgOCwgMjAgKyA4KTtcbiAgICB9XG4gICAgaWYoYWJzKGZvcmNlKSA+IDIpIHtcbiAgICAgIGVsbGlwc2UocG9zLngsIHBvcy55LCAyMCArIDE0LCAyMCArIDE0KTtcbiAgICB9XG5cbiAgICBmaWxsKGMpO1xuICAgIHRleHRBbGlnbihDRU5URVIpO1xuICAgIC8vdGV4dChmb3JjZSwgc2VsZi5wb3MueCwgc2VsZi5wb3MueSArIDkgLyAyKTtcbiAgfVxuICBzZWxmLmQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZDtcbiAgfVxuICBzZWxmLmlzUHVsbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoZCA8IDApO1xuICB9XG4gIHNlbGYuaXNQdXNoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChkID4gMCk7XG4gIH1cblxuXG59IiwiZnVuY3Rpb24gcHVsbEFycm93KHgxLCB5MSwgeDIsIHkyLCBsZW4pIHtcbiAgbGluZSh4MSwgeTEsIHgyLCB5Mik7XG4gIC8vbGVuID0gNTtcbiAgcHVzaCgpO1xuICB0cmFuc2xhdGUoeDIsIHkyKTtcbiAgdmFyIGEgPSBhdGFuMih4MS14MiwgeTIteTEpO1xuICByb3RhdGUoYSk7XG4gIG5vU3Ryb2tlKCk7XG4gIHRyYW5zbGF0ZSgwLCBsZW4pO1xuICB0cmlhbmdsZShsZW4sIC1sZW4sIC1sZW4sIC1sZW4sIDAsIDApXG4gIHBvcCgpO1xufVxuXG5mdW5jdGlvbiBwdXNoQXJyb3coeDEsIHkxLCB4MiwgeTIsIGxlbikge1xuICBsaW5lKHgxLCB5MSwgeDIsIHkyKTtcbiAgLy9sZW4gPSA1O1xuICBwdXNoKCk7XG4gIHRyYW5zbGF0ZSh4MSwgeTEpO1xuICB2YXIgYSA9IGF0YW4yKHgxLXgyLCB5Mi15MSk7XG4gIHJvdGF0ZShhKTtcbiAgbm9TdHJva2UoKTtcbiAgdHJpYW5nbGUobGVuLCAtbGVuLCAtbGVuLCAtbGVuLCAwLCAwKVxuICBwb3AoKTtcbn1cblxuZnVuY3Rpb24gR3JpZE1hcmtlcihwb3MpIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vc2VsZi5vcmlnaW5hbFBvcyA9IHBvcy5jb3B5KCk7XG4gIHNlbGYucG9zID0gcG9zO1xuICBzZWxmLmRpciA9IGNyZWF0ZVZlY3RvcigwLCAwKTtcbiAgc2VsZi5vZmZzZXQgPSBjcmVhdGVWZWN0b3IoMCwgMCk7XG4gIHNlbGYuc3RhcnRhID0gY3JlYXRlVmVjdG9yKDAsIDApO1xuICBzZWxmLmVuZGEgPSBjcmVhdGVWZWN0b3IoMCwgMCk7XG4gIFxuICB2YXIgbiA9IDA7XG4gIHZhciBwcEZhY3RvclN1bSA9IDA7XG4gIHZhciBwcEZhY3RvciA9IDA7XG4gIHZhciB0b3RhbEQgPSAwO1xuICB2YXIgcHBWYWx1ZXMgPSBbXTtcblxuICBmdW5jdGlvbiBkcmF3KCkge1xuICAgIHB1c2goKTtcbiAgICBcbiAgICAvLyBkcmF3IGRvdFxuICAgIG5vU3Ryb2tlKCk7XG4gICAgZmlsbChjSW5kaWdvKTtcbiAgICBlbGxpcHNlKHNlbGYucG9zLngsIHNlbGYucG9zLnksIDIsIDIpO1xuICAgIFxuICAgIHZhciBsZW4gPSA1O1xuICAgIHZhciBzdyA9IDI7XG5cbiAgICBpZihzZWxmLmRpci5tYWcoKSA8IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoc2VsZi5kaXIubWFnKCkgPCA0KSB7XG4gICAgICBsZW4gPSA0O1xuICAgICAgc3cgPSAyO1xuICAgICAgLy9yZXR1cm47XG4gICAgfVxuICAgIGlmKHNlbGYuZGlyLm1hZygpIDwgMykge1xuICAgICAgbGVuID0gMztcbiAgICAgIHN3ID0gMTtcbiAgICB9XG4gICAgLy8gZHJhdyBhcnJvd1xuICAgIG5vRmlsbCgpO1xuICAgIHN0cm9rZVdlaWdodChzdyk7XG4gICAgdmFyIGMgPSBjSW5kaWdvO1xuICAgIFxuICAgIGlmKHNlbGYuZGlyLnggPiAwKSB7XG4gICAgICAvLyBwb3NpdGl2ZSBmb3JjZVxuICAgIH0gZWxzZSB7XG4gICAgICBjID0gY1JlZDtcbiAgICB9XG4gICAgZmlsbChjKTtcbiAgICBzdHJva2UoYyk7XG4gICAgaWYoc2VsZi5kaXIueCA+IDAgJiYgcHBGYWN0b3IgPiAwIHx8IHNlbGYuZGlyLnggPCAwICYmIHBwRmFjdG9yIDwgMCApIHtcbiAgICAgIC8vIGFycm93IGF0IGVuZFxuICAgICAgcHVsbEFycm93KHNlbGYuc3RhcnRhLngsIHNlbGYuc3RhcnRhLnksIHNlbGYuZW5kYS54LCBzZWxmLmVuZGEueSwgbGVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXJyb3cgYXQgc3RhcnRcbiAgICAgIHB1c2hBcnJvdyhzZWxmLnN0YXJ0YS54LCBzZWxmLnN0YXJ0YS55LCBzZWxmLmVuZGEueCwgc2VsZi5lbmRhLnksIGxlbik7IFxuICAgIH1cbiAgICBcbiAgICBpZihzZWxmLmRpci5tYWcoKSA+IDYpIHtcbiAgICAvLyBkcmF3IHB1c2gsIHB1bGwgYmFsYW5jZVxuICAgIG5vRmlsbCgpO1xuICAgIHB1c2goKTtcbiAgICB0cmFuc2xhdGUoc2VsZi5wb3MueCwgc2VsZi5wb3MueSk7XG4gICAgdmFyIGEgPSBzZWxmLmRpci5oZWFkaW5nKCkgLSAxIC8gMiAqIFBJO1xuICAgIHJvdGF0ZShhKTtcbiAgICBzdHJva2VXZWlnaHQoMSk7XG4gICAgc3Ryb2tlKGMpO1xuICAgIHZhciBsID0gMztcbiAgICBsaW5lKC1sLCAwLCBsLCAwKTtcbiAgICBwb3AoKTtcbiAgICB9XG4gICAgXG4gICAgcG9wKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHByZXBhcmVVcGRhdGUoKSB7XG4gICAgc2VsZi5kaXIgPSBjcmVhdGVWZWN0b3IoMCwgMCk7XG4gICAgbiA9IDA7XG4gICAgcHBGYWN0b3JTdW0gPSAwO1xuICAgIHBwRmFjdG9yID0gMDtcbiAgICBwcFZhbHVlcyA9IFtdO1xuICAgIHRvdGFsRCA9IDA7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoZW5lcmd5KSB7XG5cbiAgICBpZihlbmVyZ3kuZ2V0Rm9yY2UoKSA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0b0ZvcmNlID0gcDUuVmVjdG9yLnN1YihjZW50ZXIsIGVuZXJneS5nZXRQb3MoKSk7XG4gICAgdmFyIGRpc3RhbmNlVG9Gb3JjZSA9IHBvcy5kaXN0KGVuZXJneS5nZXRQb3MoKSk7XG4gICAgLy92YXIgZGlzdGFuY2VUb0NlbnRlciA9IHBvcy5kaXN0KHA1LlZlY3Rvci5sZXJwKGNlbnRlciwgZW5lcmd5LmdldFBvcygpLCAwLjgpKTtcblxuICAgIHBwVmFsdWVzLnB1c2goW2VuZXJneS5kKCksIGRpc3RhbmNlVG9Gb3JjZV0pO1xuICAgIHRvdGFsRCArPSBkaXN0YW5jZVRvRm9yY2U7XG5cbiAgICB0b0ZvcmNlLm5vcm1hbGl6ZSgpO1xuICAgIHRvRm9yY2UueCA9IDEgKiB3ICogZW5lcmd5LmdldEZvcmNlKCk7XG4gICAgdG9Gb3JjZS55ID0gdG9Gb3JjZS55ICAqIHcgKiBlbmVyZ3kuZ2V0Rm9yY2UoKTtcblxuICAgIGlmKGVuZXJneS5pc1B1bGwoKSkge1xuICAgICAgdG9Gb3JjZS55ID0gdG9Gb3JjZS55ICogLTFcbiAgICAgIGlmKGVuZXJneS5nZXRRdWFsaXR5KCkgPCAwKSB7XG4gICAgICAgIHRvRm9yY2UueSA9IHRvRm9yY2UueSAqIDFcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYoZW5lcmd5LmdldFF1YWxpdHkoKSA8IDApIHtcbiAgICAgICAgdG9Gb3JjZS55ID0gdG9Gb3JjZS55ICogMVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0b0ZvcmNlLnggPSB0b0ZvcmNlLnggKiAxIC8gZGlzdGFuY2VUb0ZvcmNlO1xuICAgIHRvRm9yY2UueSA9IHRvRm9yY2UueSAqIDEgLyBkaXN0YW5jZVRvRm9yY2U7XG5cbiAgICBzZWxmLmRpci5hZGQodG9Gb3JjZSk7XG5cblxuICAgIFxuICB9XG5cbiAgZnVuY3Rpb24gZmluaXNoVXBkYXRlKCkge1xuXG4gICAgcHBGYWN0b3IgPSAwO1xuICAgIHBwVmFsdWVzLmZvckVhY2goZnVuY3Rpb24odCkge1xuICAgICAgcHBGYWN0b3IgKz0gdFswXSAqIHRbMV0gLyB0b3RhbEQ7XG4gICAgfSk7XG5cbiAgICAvLyBkaXJ0eSBmaXggaWYgdGhlcmUgaXMganVzdCBvbmUgZW5lcmd5IHNvdXJjZS5cbiAgICBpZihwcFZhbHVlcy5sZW5ndGggPT0gMSkge1xuICAgICAgcHBGYWN0b3IgPSAtcHBWYWx1ZXNbMF1bMF07XG4gICAgfVxuXG4gICAgLy8gc2NhbGVkUFBGYWN0b3IgMTogcHVsbCAtIC0gLSAtIC0gIDA6IHB1c2hcbiAgICBzZWxmLmRpci5saW1pdChHVSk7XG5cbiAgICB2YXIgc2NhbGVkUFBGYWN0b3IgPSBtYXAocHBGYWN0b3IsIC0xLCAxLCAwLCAxKTtcbiAgICBzZWxmLm9mZnNldCA9IHA1LlZlY3Rvci5tdWx0KHNlbGYuZGlyLCAtc2NhbGVkUFBGYWN0b3IpO1xuXG4gICAgc2VsZi5zdGFydGEgPSBwNS5WZWN0b3IuYWRkKHNlbGYucG9zLCBzZWxmLm9mZnNldCk7XG4gICAgc2VsZi5lbmRhID0gcDUuVmVjdG9yLmFkZChzZWxmLnBvcywgc2VsZi5vZmZzZXQpO1xuICAgIHNlbGYuZW5kYS5hZGQoc2VsZi5kaXIpO1xuXG4gICAgXG4gIH1cblxuICBzZWxmLnNldFBQT2ZmZXN0ID0gZnVuY3Rpb24obWluUFAsIG1heFBQKSB7XG4gICAgcmV0dXJuO1xuICAgIHZhciBzY2FsZWRQUEZhY3RvciA9IG1hcChwcEZhY3RvciwgbWluUFAsIG1heFBQLCAwLCAxKTtcblxuICAgIC8vIHNjYWxlZFBQRmFjdG9yIDE6IHB1bGwgLSAtIC0gLSAtICAwOiBwdXNoXG5cbiAgICBzY2FsZWRQUEZhY3RvciA9IG1hcChwcEZhY3RvciwgLTEsIDEsIDAsIDEpO1xuICAgIHNlbGYub2Zmc2V0ID0gcDUuVmVjdG9yLm11bHQoc2VsZi5kaXIsIC1zY2FsZWRQUEZhY3Rvcik7XG5cbiAgICBzZWxmLnN0YXJ0YSA9IHA1LlZlY3Rvci5hZGQoc2VsZi5wb3MsIHNlbGYub2Zmc2V0KTtcbiAgICBzZWxmLmVuZGEgPSBwNS5WZWN0b3IuYWRkKHNlbGYucG9zLCBzZWxmLm9mZnNldCk7XG4gICAgc2VsZi5lbmRhLmFkZChzZWxmLmRpcik7XG4gIH1cblxuICBzZWxmLmdldFBQRmFjdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHBwRmFjdG9yO1xuICB9XG5cbiAgc2VsZi5kcmF3ID0gZHJhdztcbiAgc2VsZi5wcmVwYXJlVXBkYXRlID0gcHJlcGFyZVVwZGF0ZTtcbiAgc2VsZi5maW5pc2hVcGRhdGUgPSBmaW5pc2hVcGRhdGU7XG4gIHNlbGYudXBkYXRlID0gdXBkYXRlO1xuXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9