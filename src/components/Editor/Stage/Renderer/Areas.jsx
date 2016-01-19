import React, {Component, PropTypes} from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

export function getDefs() {
  return [
    <pattern key="areas-defs-stripe" id="Stripe"
             width="10" height="10"
             patternUnits="userSpaceOnUse">
      <path d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2'
        stroke='#000000'
        stroke-width='0.5'/>
    </pattern>,
    <pattern key="areas-defs-crosshatch" id="Crosshatch"
             width="8" height="8"
             patternUnits="userSpaceOnUse">
      <path className="Pattern-crosshatch" d='M0 0L8 8ZM8 0L0 8Z' stroke-width='1' />
    </pattern>
  ];
}

export class Areas extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};

    let groups = [];

    let w = 5;
    let h = 5;
     groups.push(
        <g key={'core'} className={'Areas-core'}>
          <rect className={'Areas-core Areas-problem'} x={0} y={-5 * gridUnit} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-competitor'} x={0} y={0} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-solution'} x={-5 * gridUnit} y={0} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-uniqueness'} x={-5 * gridUnit} y={-5 * gridUnit} width={w * gridUnit} height={w * gridUnit} />
        </g>
      );

    let contextPoints1 = [[0,5], [0,8.5], [8,8.5], [8,8], [5,5]];
    let gridContextPoints1 = contextPoints1.map(function(point) {
      return [point[0] * gridUnit, -point[1] * gridUnit]
    }).reduce(function(a, b) {
      return a.concat(b);
    }, []).join(',');

    let contextPoints2 = [[5,5], [8,8], [8.5,8], [8.5,0], [5,0]];
    let gridContextPoints2 = contextPoints2.map(function(point) {
        return [point[0] * gridUnit, -point[1] * gridUnit]
      }).reduce(function(a, b) {
        return a.concat(b);
      }, []).join(',');

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant) {

      var deg = quadrant.deg;
      var transform = "rotate(" + deg + ")";

      let w = 5 * quadrant.coefficient.x;
      let h = 5 * quadrant.coefficient.y;

      var label1 = 0;
      if(deg == 90 || deg == 270) {
        label1 = 1;
      }
      var label2 = label1 == 0 ? 1 : 0

      groups.push(
        <g key={deg + '-1'} transform={transform}>
          <polygon className={'Areas-context Areas-' + quadrant.labels[label1]} points={gridContextPoints1} />
          <polygon className={'Areas-context Areas-' + quadrant.labels[label2]} points={gridContextPoints2} />
        </g>
      );

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Areas" className="Areas" transform={transform} fill='none'>{groups}</g>;
  }

}

Areas.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
};
