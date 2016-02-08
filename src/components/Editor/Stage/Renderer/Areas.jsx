import React, {Component} from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import PropTypes from '../../../../PropTypes';

function convertPointsToScaledSvgPath(points, gridUnit) {
  return points.map(
      (point) => {
        return Array(point[0] * gridUnit, -point[1] * gridUnit);
      }
    )
    .reduce(
      (a, b) => {
        return a.concat(b);
      }
    , [])
    .join(',');
}

export class Areas extends Component {

  render() {
    const {gridUnit} = this.props;

    let groups = [];

    let w = 5;
    let h = 5;

     groups.push(
        <g key={'core'} className={'Areas-core'}>
          <rect className={'Areas-core Areas-problem'} x={0} y={-h * gridUnit} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-competition'} x={0} y={0} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-solution'} x={-w * gridUnit} y={0} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-uniqueness'} x={-w * gridUnit} y={-h * gridUnit} width={w * gridUnit} height={w * gridUnit} />
        </g>
      );

    const gridContextPoints1 = convertPointsToScaledSvgPath([[0,5], [0,8.5], [8,8.5], [8,8], [5,5]], gridUnit);
    const gridContextPoints2 = convertPointsToScaledSvgPath([[5,5], [8,8], [8.5,8], [8.5,0], [5,0]], gridUnit);

    ForceFieldAnatomy.QUADRANTS.forEach((quadrant) => {

      const deg = quadrant.deg;
      const transform = `rotate(${deg})`;

      const w = 5 * quadrant.coefficient.x;
      const h = 5 * quadrant.coefficient.y;

      let labelIndex1 = 0;
      let labelIndex2 = 1;
      if(deg === 90 || deg === 270) {
        labelIndex1 = 1;
        labelIndex2 = 0;
      }

      groups.push(
        <g key={`${deg}'-1'`} transform={transform}>
          <polygon className={`Areas-context Areas-${quadrant.labels[labelIndex1]}`} points={gridContextPoints1} />
          <polygon className={`Areas-context Areas-${quadrant.labels[labelIndex2]}`} points={gridContextPoints2} />
        </g>
      );

    });

    return <g id="Areas" className="Areas" fill='none'>{groups}</g>;
  }

}

Areas.propTypes = {
  gridUnit: PropTypes.number.isRequired,
};
