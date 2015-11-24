import {ForceFieldCalculationSingleton} from './ForceFieldCalculation';

export const ForceFieldCanvas = {
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

    // circle
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
    var forceField = ForceFieldCalculationSingleton.getInstance()
    var forceVector = forceField.forceVectorAtPoint(pos.x, pos.y)

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
};
