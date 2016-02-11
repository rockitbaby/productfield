import React, {Component, PropTypes} from 'react';
import Vector from 'victor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import {ForceFieldCalculator} from './ForceFieldCalculator';
import {ForceArrow} from './ForceArrow';

const ARROW_GRID_CORRECTION_FACTOR = 0.8;

export class Forces extends Component {

  render() {
    const {
      gridUnit, scaleFactor,
      minArrowLength, arrowTriangleSize, arrowsPerSide,
    } = this.props;

    const forceCalculator = new ForceFieldCalculator(this.props.energies);

    const arrows = ForceFieldAnatomy.QUADRANTS.map((quadrant) => {
      const arrows = [];
      for (let ix = 0; ix <= arrowsPerSide; ix++) {
        for (let iy = 0; iy <= arrowsPerSide; iy++) {

          const x = quadrant.coefficient.x * ix;
          const y = quadrant.coefficient.y * iy;

          const result = forceCalculator.forceVectorAtPoint(x * gridUnit, y * gridUnit);
          const arrowLength = result.length() * scaleFactor * ARROW_GRID_CORRECTION_FACTOR;

          if (arrowLength < minArrowLength) {
            continue;
          }
          const scaledX = x * scaleFactor;
          const scaledY = -y * scaleFactor;

          arrows.push(
            <ForceArrow key={`${x},${y}`}
              deg={result.clone().invert().verticalAngleDeg()}
              x={scaledX}
              y={scaledY}
              x2={scaledX}
              y2={scaledY + arrowLength}
              triangleSize={arrowTriangleSize}
              skin={this.props.skin} />
            );

        }
      }
      return arrows;
    });

    return (
      <g id="Forces" className="Forces">
        {arrows}
      </g>
    );
  }
}

Forces.propTypes = {
  energies: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    strength: PropTypes.number.isRequired,
  })),
  scaleFactor: PropTypes.number,
  gridUnit: PropTypes.number,
  arrowTriangleSize: PropTypes.number,
  minArrowLength: PropTypes.number,
  arrowsPerSide: PropTypes.number,
  skin: PropTypes.shape({
    negativeArrow: PropTypes.string.isRequired,
    positiveArrow: PropTypes.string.isRequired,
  }).isRequired,
};

Forces.defaultProps = {
  energies: [],
  scaleFactor: 1,
  gridUnit: 1,
  arrowTriangleSize: 4,
  minArrowLength: 1,
  arrowsPerSide: 10,
};
