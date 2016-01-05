import React, {Component, PropTypes} from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';

const CONTEXT_CIRCLE_RADIUS = 1.5;
const DEFAULT_CIRCLE_RADIUS = 1;

export class Grid extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit, skin: {dots}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};

    let circles = []
    [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: -1}, {x: -1, y: 1}].forEach(function(quadrantCoefficient) {
      for(let ix = 0; ix < 10; ix++) {
        for(let iy = 0; iy < 10; iy++) {

          let x = quadrantCoefficient.x * ix;
          let y = quadrantCoefficient.y * iy;
          let forceFieldDescriptor = new ForceFieldDescriptor(x / 10, y / 10);
          let radius = DEFAULT_CIRCLE_RADIUS;
          if(forceFieldDescriptor.isCenter()) {
            continue;
          }
          if(forceFieldDescriptor.isContext()) {
            radius = CONTEXT_CIRCLE_RADIUS;
          }
          const classNames = forceFieldDescriptor.getClassNames();
          circles.push(<circle key={`${x},${y}`} className={classNames} cx={x * gridUnit} cy={-y * gridUnit} r={radius} stroke={dotsColor} />)
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
};
