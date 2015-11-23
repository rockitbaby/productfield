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