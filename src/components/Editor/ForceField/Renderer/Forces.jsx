import React from 'react';
import {ForceFieldCalculationSingleton} from '../../../../ForceFieldCalculation';


var ForceArrow = React.createClass({

  render: function() {

    var transform = "rotate(" + this.props.deg + "," + this.props.x + "," + this.props.y + ")";
    var triangleCoordinates = [this.props.x2, this.props.y2, this.props.x2 + this.props.triangleSize, this.props.y2, this.props.x2, this.props.y2 - this.props.triangleSize, this.props.x2 - this.props.triangleSize, this.props.y2, this.props.x2, this.props.y2].join();

    return <g><line x1={this.props.x} y1={this.props.y} x2={this.props.x2} y2={this.props.y2} strokeWidth='1' stroke='black' transform={transform} />
      <polyline points={triangleCoordinates} transform={transform} fill='black' /></g>;

  }
});

export default React.createClass({

  render: function() {

    const offsetX = Math.floor(this.props.stageWidth - this.props.fieldSize) / 2 % this.props.gridUnit;
    const offsetY = Math.floor(this.props.stageHeight / 2 - this.props.fieldSize / 2) % this.props.gridUnit

    var ForceFieldCalculator = ForceFieldCalculationSingleton.getInstance();

    var arrows = []
    for(var x = offsetX; x < this.props.stageWidth; x = x + this.props.gridUnit) {
      for(var y = offsetY; y < this.props.stageHeight; y = y + this.props.gridUnit) {

        // normalize coordinates
        var [normaliedX, normalizedY] = this.props.normalizeCoordinates(x, y);
        var result = ForceFieldCalculator.forceVectorAtPoint(normaliedX, normalizedY);

        var length = Math.sqrt(Math.pow(result.x / this.props.gridUnit, 2) + Math.pow(result.y / this.props.gridUnit, 2));

        //Show Arrows and lines only if they're long enough
        var xDelta = result.x / this.props.gridUnit;
        var yDelta = result.y / this.props.gridUnit;

        var x2 = x;
        var y2 = y - length;

        //Calculation of degree for direction
        var a = Math.atan(result.y / result.x);
        var deg = (180 / Math.PI) * a;

        if(yDelta > 0) {
          var deg = 180 / a;
        } else {
          var deg = 180 / a + 180;
        }

        var props = {
          deg: deg,
          x: x,
          x2: x2,
          y: y,
          y2: y2,
          triangleSize: 4
        }

        arrows.push(<ForceArrow key={`${x},${y}`} {...props} />)
      }
    }

    return <g>{arrows}</g>;
  }
});
