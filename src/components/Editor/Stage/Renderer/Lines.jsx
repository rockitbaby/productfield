import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

function getLine(from, to, gridUnit) {
  return <line key={uuid.v1()} stroke={'black'} strokeWidth={2} x1={from.x * gridUnit} y1={-from.y * gridUnit} x2={to.x * gridUnit} y2={-to.y * gridUnit} />
}

function P(x, y) {
  return {
    x: x,
    y: y
  }
}

export class Lines extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit, skin: {dots}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};

    let lines = [];
    lines.push(getLine(P(-5, 5), P(5, 5), gridUnit));
    lines.push(getLine(P(5, 5), P(5, -5), gridUnit));
    lines.push(getLine(P(5, -5), P(-5, -5), gridUnit));
    lines.push(getLine(P(-5, -5), P(-5, 5), gridUnit));

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant) {

      let x1 = 0 * quadrant.coefficient.x;
      let y1 = 1.8 * quadrant.coefficient.y;
      let x2 = 0 * quadrant.coefficient.x;
      let y2 = 5 * quadrant.coefficient.y;

      lines.push(getLine(P(x1, y1), P(x2, y2), gridUnit));

      x1 = 1.8 * quadrant.coefficient.x;
      y1 = 0 * quadrant.coefficient.y;
      x2 = 5 * quadrant.coefficient.x;
      y2 = 0 * quadrant.coefficient.y;

      lines.push(getLine(P(x1, y1), P(x2, y2), gridUnit));

      // dashed
      x1 = 0 * quadrant.coefficient.x;
      y1 = 5 * quadrant.coefficient.y;
      x2 = 0 * quadrant.coefficient.x;
      y2 = 8.5 * quadrant.coefficient.y;

      lines.push(getLine(P(x1, y1), P(x2, y2), gridUnit));

      x1 = 5 * quadrant.coefficient.x;
      y1 = 0 * quadrant.coefficient.y;
      x2 = 8.5 * quadrant.coefficient.x;
      y2 = 0 * quadrant.coefficient.y;

      lines.push(getLine(P(x1, y1), P(x2, y2), gridUnit));

      x1 = 5 * quadrant.coefficient.x;
      y1 = 5 * quadrant.coefficient.y;
      x2 = 8 * quadrant.coefficient.x;
      y2 = 8 * quadrant.coefficient.y;

      lines.push(getLine(P(x1, y1), P(x2, y2), gridUnit));

      //lines.push(<text className="Labels-character" x={x * gridUnit} y={-y * gridUnit + considerHeight * LABEL_HEIGHT} textAnchor={textAnchor}>{quadrant.name}</text>)

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Lines" transform={transform}>{lines}</g>;
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
