import React, {Component} from 'react';
import PropTypes from '../PropTypes';
import ForceFieldDescriptor from '../ForceFieldDescriptor';
import ForceFieldAnatomy from '../ForceFieldAnatomy';

const INTERSECTION_CIRCLE_RADIUS = 4;
const DEFAULT_CIRCLE_RADIUS = 1;

function hasIntersection(a, b) {
  return new Set([...a].filter((x) => b.has(x))).size;
}

export class Grid extends Component {

  render() {
    const {scaleFactor, gridUnit, dotsPerSide, skin: {dots}} = this.props;
    const dotHighlights = new Set(this.props.dots);

    const circles = ForceFieldAnatomy.QUADRANTS.map((quadrant) => {
      const circles = [];
      for (let ix = 0; ix <= dotsPerSide; ix++) {
        for (let iy = 0; iy <= dotsPerSide; iy++) {

          if (ix + iy === 0) {
            continue;
          }

          const x = quadrant.coefficient.x * ix;
          const y = quadrant.coefficient.y * iy;
          const forceFieldDescriptor = new ForceFieldDescriptor(x * gridUnit, y * gridUnit);

          if (forceFieldDescriptor.isCenter()) {
            continue;
          }
          let radius = DEFAULT_CIRCLE_RADIUS;
          const classNames = forceFieldDescriptor.getClassNames();
          const names = new Set(forceFieldDescriptor.getNames());

          if (hasIntersection(names, dotHighlights)) {
            radius = INTERSECTION_CIRCLE_RADIUS;
          }

          const scaledX = x * scaleFactor;
          const scaledY = y * scaleFactor;

          circles.push(
            <circle key={`${quadrant.deg}:${x},${y}`} className={classNames}
              cx={scaledX} cy={-scaledY}
              r={radius}
              fill={dots} />
            );

        }
      }
      return circles;
    });

    return (
      <g id="Grid" className="Grid">
        {circles}
      </g>
    );
  }
}

Grid.propTypes = {
  scaleFactor: PropTypes.number,
  gridUnit: PropTypes.number,
  dotsPerSide: PropTypes.number,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
  dots: PropTypes.arrayOf(PropTypes.string),
};

Grid.defaultProps = {
  scaleFactor: 1,
  gridUnit: 1,
  dotsPerSide: 5,
  dots: [],
};
