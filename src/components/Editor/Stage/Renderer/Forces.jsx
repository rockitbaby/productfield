import React, {Component, PropTypes} from 'react';
import Vector from 'victor';
import {ForceFieldCalculationSingleton} from '../../../../ForceFieldCalculation';

export class ForceArrow extends Component {

  render() {
    const {x, y, x2, y2, triangleSize, deg} = this.props;
    const point1 = new Vector(x, y);
    const point2 = new Vector(x2, y2);
    const line = point2.clone().subtract(point1);
    const lineLength = line.length();
    const angle = line.angleDeg();
    const arrowTransform = `rotate(${Math.abs(90 + angle)}, ${x2}, ${y2})`;

    const growFactor = Math.log10(lineLength);
    const points = [
      new Vector(x2, y2),
      new Vector(x2 + triangleSize * growFactor, y2),
      new Vector(x2, y2 - triangleSize * growFactor),
      new Vector(x2 - triangleSize * growFactor, y2),
      new Vector(x2, y2),
    ];

    const triangleCoordinates = points.map((point) => `${point.x},${point.y}`);

    const color = (deg >= 0 && deg <= 180) ? this.props.skin.negativeArrow : this.props.skin.positiveArrow;

    const transform = `rotate(${deg}, ${x}, ${y}) translate(0, ${-(lineLength + triangleSize * growFactor) / 2})`;

    return (
      <g transform={transform}>
        <line
          x1={this.props.x}
          y1={this.props.y}
          x2={this.props.x2}
          y2={this.props.y2}
          strokeWidth='1'
          stroke={color} />
        <polygon points={triangleCoordinates.join(' ')} transform={arrowTransform} fill={color} />
      </g>
    );
  }
}

ForceArrow.propTypes = {
  deg: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  triangleSize: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    negativeArrow: PropTypes.string.isRequired,
    positiveArrow: PropTypes.string.isRequired,
  }).isRequired,
}

export class Forces extends Component {

  render() {
    const {stageWidth, stageHeight, fieldSize, gridUnit, minArrowLength, arrowTriangleSize} = this.props;
    const offsetX = Math.floor(stageWidth - fieldSize) / 2 % gridUnit;
    const offsetY = Math.floor(stageHeight / 2 - fieldSize / 2) % gridUnit

    var ForceFieldCalculator = ForceFieldCalculationSingleton.getInstance();

    var arrows = []
    for (let x = offsetX; x < stageWidth; x += gridUnit) {
      for (let y = offsetY; y < stageHeight; y += gridUnit) {
        const [normalizedX, normalizedY] = this.props.normalizeCoordinates(x, y);
        const result = ForceFieldCalculator.forceVectorAtPoint(normalizedX, normalizedY);
        const arrowLength = result.length() * gridUnit * 2;

        if (arrowLength < minArrowLength) {
          continue;
        }

        const props = {
          deg: result.clone().invert().verticalAngleDeg(),
          x: x,
          x2: x,
          y: y,
          y2: y + arrowLength,
          triangleSize: arrowTriangleSize,
        }

        arrows.push(<ForceArrow key={`${x},${y}`} {...props} skin={this.props.skin} />)
      }
    }

    return (
      <g>{arrows}</g>
    );
  }
};

Forces.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  arrowTriangleSize: PropTypes.number,
  minArrowLength: PropTypes.number,
  skin: PropTypes.shape({
    negativeArrow: PropTypes.string.isRequired,
    positiveArrow: PropTypes.string.isRequired,
  }).isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
};

Forces.defaultProps = {
  arrowTriangleSize: 4,
  minArrowLength: 0,
};
