import React, {Component, PropTypes} from 'react';
import Vector from 'victor';
import {ForceFieldCalculator} from './ForceFieldCalculator';
import {ForceArrow} from './ForceArrow';

const ARROW_GRID_CORRECTION_FACTOR = 0.8;

export class Forces extends Component {

  render() {
    const {stageWidth, stageHeight, fieldSize, gridUnit, minArrowLength, arrowTriangleSize} = this.props;
    const offsetX = Math.floor(stageWidth - fieldSize) / 2 % gridUnit;
    const offsetY = Math.floor(stageHeight / 2 - fieldSize / 2) % gridUnit

    const forceCalculator = new ForceFieldCalculator(this.props.energies);

    let arrows = []
    for (let x = offsetX; x < stageWidth; x += gridUnit) {
      for (let y = offsetY; y < stageHeight; y += gridUnit) {
        const [normalizedX, normalizedY] = this.props.normalizeCoordinates(x, y);
        const result = forceCalculator.forceVectorAtPoint(normalizedX, normalizedY);
        const arrowLength = result.length() * gridUnit * ARROW_GRID_CORRECTION_FACTOR;

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
}

Forces.propTypes = {
  energies: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    strength: PropTypes.number.isRequired,
  })),
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
  energies: [],
  arrowTriangleSize: 4,
  minArrowLength: 0,
};
