import React, {Component} from 'react';
import PropTypes from '../../../../PropTypes';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

const INTERSECTION_CIRCLE_RADIUS = 4;
const DEFAULT_CIRCLE_RADIUS = 1;

function hasIntersection(a, b) {
  return new Set([...a].filter((x) => b.has(x))).size;
}

export class Grid extends Component {

  render() {
    const {gridUnit, dotsPerSide, skin: {dots}} = this.props;
    const dotHighlights = new Set(this.props.dots);

    const circles = [];

    ForceFieldAnatomy.QUADRANTS.forEach((quadrant, index) => {
      for (let ix = 0; ix <= dotsPerSide; ix++) {
        for (let iy = 0; iy <= dotsPerSide; iy++) {

          if (ix + iy === 0) {
            continue;
          }

          const x = quadrant.coefficient.x * ix;
          const y = quadrant.coefficient.y * iy;
          const TEN = 10;
          const forceFieldDescriptor = new ForceFieldDescriptor(x / TEN, y / TEN);

          if (forceFieldDescriptor.isCenter()) {
            continue;
          }
          let radius = DEFAULT_CIRCLE_RADIUS;
          const classNames = forceFieldDescriptor.getClassNames();
          const names = new Set(forceFieldDescriptor.getNames());

          if (hasIntersection(names, dotHighlights)) {
            radius = INTERSECTION_CIRCLE_RADIUS;
          }

          circles.push(<circle key={`${quadrant.deg}:${x},${y}`} className={classNames} cx={x * gridUnit} cy={-y * gridUnit} r={radius} stroke={dots} />);

        }
      }

    });

    return <g id="Grid" className="Grid">{circles}</g>;
  }
}

Grid.propTypes = {
  gridUnit: PropTypes.number.isRequired,
  dotsPerSide: PropTypes.number,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
  dots: PropTypes.arrayOf(PropTypes.string),
};

Grid.defaultProps = {
  dotsPerSide: 5,
  dots: [],
};
