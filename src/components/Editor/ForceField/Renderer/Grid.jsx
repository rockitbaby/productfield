import React, {Component, PropTypes} from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';

const CONTEXT_CIRCLE_RADIUS = 1.5;
const DEFAULT_CIRCLE_RADIUS = 1;

export class Grid extends Component {

  render() {
    const {stageWidth, stageHeight, fieldSize, gridUnit, skin: {dots}} = this.props;

    const offsetX = Math.floor(stageWidth / 2 - fieldSize / 2) % gridUnit;
    const offsetY = Math.floor(stageHeight / 2 - fieldSize / 2) % gridUnit

    var circles = []
    for (var x = offsetX; x < stageWidth; x = x + gridUnit) {
      for (var y = offsetY; y < stageHeight; y = y + gridUnit) {
        const [normalizedX, normalizedY] = this.props.normalizeCoordinates(x, y);
        var forceFieldDescriptor = new ForceFieldDescriptor(normalizedX, normalizedY);
        var radius = DEFAULT_CIRCLE_RADIUS;
        if (forceFieldDescriptor.isCenter()) {
          continue;
        }
        if (forceFieldDescriptor.isContext()) {
          radius = CONTEXT_CIRCLE_RADIUS;
        }
        const classNames = forceFieldDescriptor.getClassNames();
        circles.push(<circle key={`${x},${y}`} className={classNames} cx={x} cy={y} r={radius} stroke={dots} />)
      }
    }
    return <g>{circles}</g>;
  }
}

Grid.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
};
