import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';
import ForceFieldAnatomy from '../ForceFieldAnatomy';

import {allowCustomAttributes} from 'utils';
import DOMProperty from 'react/lib/DOMProperty';

allowCustomAttributes(DOMProperty, ['stroke-dasharray']);

const DEFAULT_LINE_COLOR = '#000000';
const LINE_WIDTH = 2;
const DASHED_LINE_STROKE = 5;

function P(x, y) {
  return {
    x: x,
    y: y,
  };
}

class Line extends Component {

  render() {
    const {scaleFactor, from, to, className, dashed, lineColor} = this.props;
    if (dashed) {
      return (
        <line className={className}
          stroke-dasharray={`${DASHED_LINE_STROKE}, ${DASHED_LINE_STROKE}`}
          stroke={lineColor} strokeWidth={LINE_WIDTH}
          x1={from.x * scaleFactor}
          y1={-from.y * scaleFactor}
          x2={to.x * scaleFactor}
          y2={-to.y * scaleFactor} />
        );
    } else {
      return (
        <line className={className}
          stroke={lineColor} strokeWidth={LINE_WIDTH}
          x1={from.x * scaleFactor}
          y1={-from.y * scaleFactor}
          x2={to.x * scaleFactor}
          y2={-to.y * scaleFactor} />
        );
    }
  }
}

Line.propTypes = {
  scaleFactor: PropTypes.number,
  from: PropTypes.object,
  to: PropTypes.object,
  dashed: PropTypes.bool,
  className: PropTypes.string,
  lineColor: PropTypes.string,
};

Line.defaultProps = {
  scaleFactor: 1,
  dashed: false,
  lineColor: DEFAULT_LINE_COLOR,
};

export class Lines extends Component {

  render() {
    const {
      scaleFactor, lineColor,
      coreWidth, contextWidth, centerCircleRadius, contextMarkerSize,
    } = this.props;
    const scaledCoreWidth = coreWidth * scaleFactor;

    const lines = ForceFieldAnatomy.QUADRANTS.map((quadrant) => {
      const lines = [];

      let x1 = 0;
      let y1 = centerCircleRadius * quadrant.coefficient.y;
      let x2 = 0;
      let y2 = coreWidth * quadrant.coefficient.y;
      let key = `${quadrant.deg}-1`;

      lines.push(
        <Line key={key} className='Lines-core'
          from={P(x1, y1)} to={P(x2, y2)} lineColor={lineColor}
          scaleFactor={scaleFactor} />
      );

      x1 = centerCircleRadius * quadrant.coefficient.x;
      y1 = 0;
      x2 = coreWidth * quadrant.coefficient.x;
      y2 = 0;
      key = `${quadrant.deg}-2`;

      lines.push(
        <Line key={key} className='Lines-core'
          from={P(x1, y1)} to={P(x2, y2)} lineColor={lineColor}
          scaleFactor={scaleFactor} />
      );

      // dashed
      x1 = 0;
      y1 = coreWidth * quadrant.coefficient.y;
      x2 = 0;
      y2 = (contextWidth + contextMarkerSize) * quadrant.coefficient.y;
      key = `${quadrant.deg}-3`;

      lines.push(
        <Line key={key} className='Lines-context' dashed={true}
          from={P(x1, y1)} to={P(x2, y2)} lineColor={lineColor}
          scaleFactor={scaleFactor} />
      );

      x1 = coreWidth * quadrant.coefficient.x;
      y1 = 0;
      x2 = (contextWidth + contextMarkerSize) * quadrant.coefficient.x;
      y2 = 0;
      key = `${quadrant.deg}-4`;

      lines.push(
        <Line key={key} className='Lines-context' dashed={true}
          from={P(x1, y1)} to={P(x2, y2)} lineColor={lineColor}
          scaleFactor={scaleFactor} />
      );

      x1 = coreWidth * quadrant.coefficient.x;
      y1 = coreWidth * quadrant.coefficient.y;
      x2 = contextWidth * quadrant.coefficient.x;
      y2 = contextWidth * quadrant.coefficient.y;
      key = `${quadrant.deg}-5`;

      lines.push(
        <Line key={key} className='Lines-context'
          from={P(x1, y1)} to={P(x2, y2)} lineColor={lineColor}
          scaleFactor={scaleFactor} />
      );
      return lines;
    });

    return (
      <g id="Lines" className="Lines">
        <rect className='Lines-core'
          x={-scaledCoreWidth} y={-scaledCoreWidth}
          width={scaledCoreWidth * 2} height={scaledCoreWidth * 2}
          fill='none' strokeWidth={LINE_WIDTH} stroke={lineColor}/>
        {lines}
      </g>
    );
  }

}

Lines.propTypes = {
  scaleFactor: PropTypes.number,
  contextWidth: PropTypes.number,
  coreWidth: PropTypes.number,
  centerCircleRadius: PropTypes.number,
  contextMarkerSize: PropTypes.number,
  lineColor: PropTypes.string,
};

Lines.defaultProps = {
  scaleFactor: 1,
  contextWidth: 8,
  coreWidth: 5,
  centerCircleRadius: Math.sqrt(2),
  contextMarkerSize: 0.5,
  lineColor: DEFAULT_LINE_COLOR,
};
