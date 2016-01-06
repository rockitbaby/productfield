import React, {Component, PropTypes} from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';

const INTERSECTION_CIRCLE_RADIUS = 4;
const DEFAULT_CIRCLE_RADIUS = 1;

export class Grid extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit, skin: {dots}, highlights} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};
    const highlights = new Set(highlights);

    let circles = []
    [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: -1}, {x: -1, y: 1}].forEach(function(quadrantCoefficient) {
      for(let ix = 0; ix < 10; ix++) {
        for(let iy = 0; iy < 10; iy++) {

          let x = quadrantCoefficient.x * ix;
          let y = quadrantCoefficient.y * iy;
          let forceFieldDescriptor = new ForceFieldDescriptor(x / 10, y / 10);
          let radius = DEFAULT_CIRCLE_RADIUS;
          if (forceFieldDescriptor.isCenter()) {
            continue;
          }

          const names = new Set(forceFieldDescriptor.getNames());

          let intersection = new Set([...names].filter(x => highlights.has(x)));

          if (intersection.size) {
            radius = INTERSECTION_CIRCLE_RADIUS;
          }
          const classNames = forceFieldDescriptor.getClassNames();
          circles.push(<circle key={`${x},${y}`} className={classNames} cx={x * gridUnit} cy={-y * gridUnit} r={radius} stroke={dots} />)
        }
      }

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Grid-dots" transform={transform}>{circles}</g>;
  }
}

Grid.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
  highlights: PropTypes.arrayOf(PropTypes.string),
};

Grid.defaultProps = {
  highlights: [],
};
