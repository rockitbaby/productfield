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
    const {origin, gridUnit, skin: {dots}} = this.props;
    const dotHighlights = new Set(this.props.dots);

    let circles = []

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant, index) {
      for(let ix = 0; ix <= ForceFieldAnatomy.DOTS_PER_SIDE; ix++) {
        for(let iy = 0; iy <= ForceFieldAnatomy.DOTS_PER_SIDE; iy++) {

          if (ix + iy === 0) {
            continue;
          }

          const x = quadrant.coefficient.x * ix;
          const y = quadrant.coefficient.y * iy;
          const TEN = 10;
          const forceFieldDescriptor = new ForceFieldDescriptor(x / TEN, y / TEN);

          if(forceFieldDescriptor.isCenter()) {
            continue;
          }
          let radius = DEFAULT_CIRCLE_RADIUS;
          const classNames = forceFieldDescriptor.getClassNames();
          const names = new Set(forceFieldDescriptor.getNames());

          if(hasIntersection(names, dotHighlights)) {
            radius = INTERSECTION_CIRCLE_RADIUS;
          }

          circles.push(<circle key={`${quadrant.deg}:${x},${y}`} className={classNames} cx={x * gridUnit} cy={-y * gridUnit} r={radius} stroke={dots} />);

        }
      }

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Grid" className="Grid" transform={transform}>{circles}</g>;
  }
}

Grid.propTypes = {
  origin: PropTypes.point.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
  dots: PropTypes.arrayOf(PropTypes.string),
};

Grid.defaultProps = {
  dots: [],
};
