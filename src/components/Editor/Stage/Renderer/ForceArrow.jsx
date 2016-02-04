import React, {Component, PropTypes} from 'react';
import Vector from 'victor';

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
