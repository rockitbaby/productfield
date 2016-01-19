import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import DOMProperty from 'react/lib/DOMProperty';

// wating for https://github.com/facebook/react/pull/5714/files in react 0.15.0
// for now:
// https://github.com/facebook/react/issues/1657#issuecomment-70786561

DOMProperty.injection.injectDOMPropertyConfig({
  isCustomAttribute: function (attributeName) {
    return (attributeName === 'stroke-dasharray');
  }
});

function P(x, y) {
  return {
    x: x,
    y: y
  }
}

class Line extends Component {

  render() {
    const {from, to, gridUnit, className, dashed} = this.props;

    if(dashed) {
      return <line className={className} stroke-dasharray="5, 5" stroke={'black'}  strokeWidth={2} x1={from.x * gridUnit} y1={-from.y * gridUnit} x2={to.x * gridUnit} y2={-to.y * gridUnit} />
    } else {
      return <line className={className} stroke={'black'} strokeWidth={2} x1={from.x * gridUnit} y1={-from.y * gridUnit} x2={to.x * gridUnit} y2={-to.y * gridUnit} />
    }

  }
}

Line.propTypes = {
  gridUnit: React.PropTypes.number,
  from: React.PropTypes.object,
  to: React.PropTypes.object,
  dashed: React.PropTypes.bool,
  className: React.PropTypes.string
};

export class Lines extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit, skin: {dots}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};

    let lines = [];
    lines.push(<Line key={'core-1'} className='Lines-core' from={P(-5, 5)} to={P(5, 5)} gridUnit={gridUnit} />);
    lines.push(<Line key={'core-2'} className='Lines-core' from={P(5, 5)} to={P(5, -5)} gridUnit={gridUnit} />);
    lines.push(<Line key={'core-3'} className='Lines-core' from={P(5, -5)} to={P(-5, -5)} gridUnit={gridUnit} />);
    lines.push(<Line key={'core-4'} className='Lines-core' from={P(-5, -5)} to={P(-5, 5)} gridUnit={gridUnit} />);

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant) {

      let x1 = 0 * quadrant.coefficient.x;
      let y1 = ForceFieldAnatomy.CENTER_RADIUS * quadrant.coefficient.y;
      let x2 = 0 * quadrant.coefficient.x;
      let y2 = 5 * quadrant.coefficient.y;
      let key = quadrant.deg + '-1';

      lines.push(<Line key={key} className='Lines-core' from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      x1 = ForceFieldAnatomy.CENTER_RADIUS * quadrant.coefficient.x;
      y1 = 0 * quadrant.coefficient.y;
      x2 = 5 * quadrant.coefficient.x;
      y2 = 0 * quadrant.coefficient.y;
      key = quadrant.deg + '-2';

      lines.push(<Line key={key} className='Lines-core' from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      // dashed
      x1 = 0 * quadrant.coefficient.x;
      y1 = 5 * quadrant.coefficient.y;
      x2 = 0 * quadrant.coefficient.x;
      y2 = 8.5 * quadrant.coefficient.y;
      key = quadrant.deg + '-3';

      lines.push(<Line key={key} className='Lines-context' dashed={true} from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      x1 = 5 * quadrant.coefficient.x;
      y1 = 0 * quadrant.coefficient.y;
      x2 = 8.5 * quadrant.coefficient.x;
      y2 = 0 * quadrant.coefficient.y;
      key = quadrant.deg + '-4';

      lines.push(<Line key={key} className='Lines-context' dashed={true} from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      x1 = 5 * quadrant.coefficient.x;
      y1 = 5 * quadrant.coefficient.y;
      x2 = 8 * quadrant.coefficient.x;
      y2 = 8 * quadrant.coefficient.y;
      key = quadrant.deg + '-5';

      lines.push(<Line key={key} className='Lines-context' from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      //lines.push(<text className="Labels-character" x={x * gridUnit} y={-y * gridUnit + considerHeight * LABEL_HEIGHT} textAnchor={textAnchor}>{quadrant.name}</text>)

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Lines" className="Lines" transform={transform}>{lines}</g>;
  }

}

Lines.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
};
