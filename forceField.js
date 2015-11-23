var ForceField;
window.ForceField = ForceField || {
  options: {
    gridUnit: 28,
    scale: 20,
    gridDotSize: 6,
    cRed: "#FF3D00",
    cGreen: "#00E676",
    cIndigo: "#304FFE",
    cLightGrey: "#F2F2F2",
    cBlack: "#000000"
  },
  init: function() {
    this.options.gu10 = this.options.gridUnit * 10;
    this.options.width = this.options.gridUnit * this.options.scale;
    this.options.height = this.options.gridUnit * this.options.scale;
  },
  drawGridChrome: function() {
    push();
    translate(this.options.width / 2, this.options.height / 2);

    var gu = this.options.gridUnit;

    // circel
    noFill();
    stroke(this.options.cIndigo);
    strokeWeight(2);
    ellipseMode(CENTER);
    var r = sqrt(sq(gu) * 2) * 2;

    ellipse(0, 0, r, r);

    noStroke();

    // dots
    fill(this.options.cIndigo);
    var dotWidth = this.options.gridDotSize;
    ellipse(5 * gu, -5 * gu, dotWidth, dotWidth);
    ellipse(5 * gu, 5 * gu, dotWidth, dotWidth);
    ellipse(-5 * gu, 5 * gu, dotWidth, dotWidth);
    ellipse(-5 * gu, -5 * gu, dotWidth, dotWidth);

    // edges
    fill(this.options.cIndigo);
    var ew = 2;
    rect(8 * gu, -8 * gu  - ew / 2, gu / 2, ew);
    rect(8 * gu - ew / 2, -8 * gu - gu / 2, ew, gu / 2);

    rect(8 * gu, 8 * gu  - ew / 2, gu / 2, ew);
    rect(8 * gu - ew / 2, 8 * gu, ew, gu / 2);

    rect(-8 * gu, 8 * gu  - ew / 2, ew, gu / 2);
    rect(-8 * gu - gu / 2, 8 * gu  - ew / 2, gu / 2, ew);


    rect(-8 * gu, -8 * gu  - gu / 2, ew, gu / 2);
    rect(-8 * gu - gu / 2, -8 * gu  - ew / 2, gu / 2, ew);

    pop();
  },
  getForceAtPosition: function(pos) {
    // dir: direction of vector
    // dir.x: between -1 and 1
    // dir.y: between -1 and 1
    // strength: between 0 and 1
    var number = .4;//Math.random()
    return {dir: {x: (-1 + number * 2), y: (-1 + number * 2)}, strength: 1};
  },
  drawForce: function(pos) {
    var force = this.getForceAtPosition(pos);

    push();
    translate(this.options.width / 2, this.options.height / 2);

    var self = this;
    function pullArrow(x1, y1, x2, y2, len) {
      stroke(self.options.cBlack)
      line(x1, y1, x2, y2);
      push();
      translate(x2, y2);
      var a = atan2(x1-x2, y2-y1);
      rotate(a);
      noStroke();
      fill(self.options.cBlack);
      translate(0, len);
      triangle(len, -len, -len, -len, 0, 0)
      pop();
    }

    var gu10 = this.options.gu10;
    var gu = this.options.gridUnit;
    pullArrow(
      pos.x * gu10,
      pos.y * gu10,
      pos.x * gu10 + force.dir.x * gu,
      pos.y * gu10 + force.dir.y * gu,
      4 //force.strength * GU
    )

    pop();
  },
  addEnergyFromEvent: function(event) {
    $canvas = $(event.target);
    // var gridX = ((event.offsetX - ($canvas.data("gridDotSize")/2)) - ($canvas.width()/2)) / (($canvas.data("gridUnit")/2)*($canvas.data("gridScale")));
    // console.log((event.offsetX - ($canvas.width()/2)) / (($canvas.data("gridUnit")/2)*($canvas.data("gridScale"))));
    //
    // var gridY = ((event.offsetY - ($canvas.data("gridDotSize")/2)) - ($canvas.height()/2)) / (($canvas.data("gridUnit")/2)*($canvas.data("gridScale"))) * -1;
    // console.log((event.offsetY - ($canvas.height()/2)) / (($canvas.data("gridUnit")/2)*($canvas.data("gridScale")))*-1);
    // debugger
    $newDot = $("<div/>")
      .addClass("forcefield-dot")
      .css("width", this.options.gridDotSize)
      .css("height", this.options.gridDotSize)
      .css("top", event.offsetY - (this.options.gridDotSize / 2))
      .css("left", event.offsetX - (this.options.gridDotSize / 2))
      .css("border-radius", this.options.gridDotSize / 2);

    $(".forcefield").append($newDot);
  },
  getAllEnergies: function() {
    return $(".forcefield-dot")
  }
};

window.setup = function() {
  ForceField.init();
  canvas = createCanvas();
  $canvas = $(canvas.elt);
  $canvas.css({
    display: 'block'
  });
  $canvas.data({
    gridUnit: ForceField.options.gridUnit,
    gridScale: ForceField.options.scale,
    gridDotSize: ForceField.options.gridDotSize
  });
  $('.forcefield').append($canvas);
  frameRate(30);
  resizeCanvas(ForceField.options.width, ForceField.options.height);
};

window.draw = function() {
  background('#FFFFFF');
  ForceField.drawGridChrome();

  for(var x = -1; x < 1; x = x + 0.1) {
    for(var y = -1; y < 1; y = y + 0.1) {
      ForceField.drawForce({x: x, y: y});
    }
  }
};

$(document).on('click', 'canvas', function(event) {
  ForceField.addEnergyFromEvent(event)
});
