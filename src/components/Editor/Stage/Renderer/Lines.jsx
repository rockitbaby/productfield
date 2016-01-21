import React, {Component} from 'react';
import uuid from 'node-uuid';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import PropTypes from '../../../../PropTypes';

import {allowCustomAttributes} from 'utils';
import DOMProperty from 'react/lib/DOMProperty';

allowCustomAttributes(DOMProperty, ['stroke-dasharray']);

function P(x, y) {
  return {
    x: x,
    y: y,
  };
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
    const {origin, gridUnit} = this.props;

    let lines = [];
    lines.push(<Line key={'core-1'} className='Lines-core' from={P(-5, 5)} to={P(5, 5)} gridUnit={gridUnit} />);
    lines.push(<Line key={'core-2'} className='Lines-core' from={P(5, 5)} to={P(5, -5)} gridUnit={gridUnit} />);
    lines.push(<Line key={'core-3'} className='Lines-core' from={P(5, -5)} to={P(-5, -5)} gridUnit={gridUnit} />);
    lines.push(<Line key={'core-4'} className='Lines-core' from={P(-5, -5)} to={P(-5, 5)} gridUnit={gridUnit} />);

    Anatomy.QUADRANTS.forEach((quadrant) => {

      let x1 = 0 * quadrant.coefficient.x;
      let y1 = Anatomy.CENTER_RADIUS * quadrant.coefficient.y;
      let x2 = 0 * quadrant.coefficient.x;
      let y2 = 5 * quadrant.coefficient.y;
      let key = `${quadrant.deg}-1`;

      lines.push(<Line key={key} className='Lines-core' from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      x1 = Anatomy.CENTER_RADIUS * quadrant.coefficient.x;
      y1 = 0 * quadrant.coefficient.y;
      x2 = 5 * quadrant.coefficient.x;
      y2 = 0 * quadrant.coefficient.y;
      key = `${quadrant.deg}-2`;

      lines.push(<Line key={key} className='Lines-core' from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      // dashed
      x1 = 0 * quadrant.coefficient.x;
      y1 = 5 * quadrant.coefficient.y;
      x2 = 0 * quadrant.coefficient.x;
      y2 = 8.5 * quadrant.coefficient.y;
      key = `${quadrant.deg}-3`;

      lines.push(<Line key={key} className='Lines-context' dashed={true} from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      x1 = 5 * quadrant.coefficient.x;
      y1 = 0 * quadrant.coefficient.y;
      x2 = 8.5 * quadrant.coefficient.x;
      y2 = 0 * quadrant.coefficient.y;
      key = `${quadrant.deg}-4`;

      lines.push(<Line key={key} className='Lines-context' dashed={true} from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);

      x1 = 5 * quadrant.coefficient.x;
      y1 = 5 * quadrant.coefficient.y;
      x2 = 8 * quadrant.coefficient.x;
      y2 = 8 * quadrant.coefficient.y;
      key = `${quadrant.deg}-5`;

      lines.push(<Line key={key} className='Lines-context' from={P(x1, y1)} to={P(x2, y2)} gridUnit={gridUnit} />);
    });

    const transform = `translate(${origin.x},${origin.y})`;
    return <g id="Lines" className="Lines" transform={transform}>{lines}</g>;
  }

}

Lines.propTypes = {
  origin: PropTypes.point.isRequired,
  gridUnit: PropTypes.number.isRequired,
};
