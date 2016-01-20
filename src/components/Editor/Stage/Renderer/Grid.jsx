import React, {Component, PropTypes} from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

const INTERSECTION_CIRCLE_RADIUS = 4;
const DEFAULT_CIRCLE_RADIUS = 1;

export function getDefs(gridUnit, offsetX, offsetY) {
  const radius = 1;
  return [
    <pattern key="Grid-defs-dots" id="dots"
           x={offsetX} y={offsetY} width={gridUnit} height={gridUnit}
           patternUnits="userSpaceOnUse">
      <circle className="off" cx={gridUnit / 2} cy={gridUnit / 2} r={radius} fill="#000000" stroke="none" />
    </pattern>
  ];
}

export class Grid extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit, skin: {dots}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};
    const dotHighlights = new Set(this.props.dots);

    let circles = []

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant, index) {
      for(let ix = 0; ix < 10; ix++) {
        for(let iy = 0; iy < 10; iy++) {

          let x = quadrant.coefficient.x * ix;
          let y = quadrant.coefficient.y * iy;
          let forceFieldDescriptor = new ForceFieldDescriptor(x / 10, y / 10);
          let radius = DEFAULT_CIRCLE_RADIUS;
          if (forceFieldDescriptor.isCenter()) {
            continue;
          }

          const names = new Set(forceFieldDescriptor.getNames());

          let intersection = new Set([...names].filter(x => dotHighlights.has(x)));

          if (intersection.size) {
            radius = INTERSECTION_CIRCLE_RADIUS;
          }
          const classNames = forceFieldDescriptor.getClassNames();
          circles.push(<circle key={`${index+1}: ${x},${y}`} className={classNames} cx={x * gridUnit} cy={-y * gridUnit} r={radius} stroke={dots} />)
        }
      }

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Grid" className="Grid" transform={transform}>{circles}</g>;
  }
}

Grid.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
  dots: PropTypes.arrayOf(PropTypes.string),
};

Grid.defaultProps = {
  dots: [],
};
