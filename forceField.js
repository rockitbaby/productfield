var ForceFieldCanvas;
window.ForceFieldCanvas = ForceFieldCanvas || {
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
    var forceField = new ForceField(this.getAllEnergies());
    var forceVector = forceField.forceVectorAtPoint(pos.x, pos.y);


    return {dir: {x: forceVector.x, y: forceVector.y}, strength: forceVector.length()};
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
    var gridScale = this.options.scale;
    var halfGridDotSize = this.options.gridDotSize / 2;
    var halfGridUnit = this.options.gridUnit / 2;
    var halfWidth = this.options.width / 2;
    var halfHeight = this.options.height / 2;

    // var gridX = ((event.offsetX - ($canvas.data("gridDotSize")/2)) - ($canvas.width()/2)) / (($canvas.data("gridUnit")/2)*($canvas.data("gridScale")));
    // var gridY = ((event.offsetY - ($canvas.data("gridDotSize")/2)) - ($canvas.height()/2)) / (($canvas.data("gridUnit")/2)*($canvas.data("gridScale"))) * -1;

    var domEnergyObjects =  $(".forcefield-dot")

    var energyObjects = domEnergyObjects.map(function(index, object) {
      return {
        pos: {
          x: ($(object).offset().left - halfGridDotSize - halfWidth) / (halfGridUnit * gridScale),
          y: ($(object).offset().top - halfGridDotSize - halfHeight) / (halfGridUnit * gridScale)
        },
        strength: 2
      }
    });

    return $.makeArray(energyObjects);
  }
};

window.setup = function() {
  ForceFieldCanvas.init();
  canvas = createCanvas();
  $canvas = $(canvas.elt);
  $canvas.css({
    display: 'block'
  });
  $canvas.data({
    gridUnit: ForceFieldCanvas.options.gridUnit,
    gridScale: ForceFieldCanvas.options.scale,
    gridDotSize: ForceFieldCanvas.options.gridDotSize
  });
  $('.forcefield').append($canvas);
  frameRate(30);
  resizeCanvas(ForceFieldCanvas.options.width, ForceFieldCanvas.options.height);
};

window.draw = function() {
  background('#FFFFFF');
  ForceFieldCanvas.drawGridChrome();

  for(var x = -1; x < 1; x = x + 0.1) {
    for(var y = -1; y < 1; y = y + 0.1) {
      ForceFieldCanvas.drawForce({x: x, y: y});
    }
  }
};

$(document).on('click', 'canvas', function(event) {
  ForceFieldCanvas.addEnergyFromEvent(event)
});
