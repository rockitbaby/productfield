import React from 'react';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

export const Areas = React.createClass({

  statics: {
    getDefs: function() {
      return <mask id="cut-off-bottom"><rect x="0" y="0" width="200" height="100" fill="#000000" /></mask>
    }
  },

  render() {
    const {fieldSize, stageWidth, stageHeight, gridUnit, skin: {dots}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};

    let groups = [];

    let w = 5;
    let h = 5;
     groups.push(
        <g className={'Areas-core'}>
          <rect className={'Areas-core Areas-problem'} x={0} y={-5 * gridUnit} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-competitor'} x={0} y={0} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-solution'} x={-5 * gridUnit} y={0} width={w * gridUnit} height={w * gridUnit} />
          <rect className={'Areas-core Areas-uniqueness'} x={-5 * gridUnit} y={-5 * gridUnit} width={w * gridUnit} height={w * gridUnit} />
        </g>
      );

    let contextPoints1 = [[0,5], [0,8], [8,8], [5,5]];
    let gridContextPoints1 = contextPoints1.map(function(point) {
      return [point[0] * gridUnit, -point[1] * gridUnit]
    }).reduce(function(a, b) {
      return a.concat(b);
    }, []).join(',');

    let contextPoints2 = [[5,5], [8,8], [8,0], [5,0]];
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
    return <g className="Areas" transform={transform}>{groups}</g>;
  },

});
