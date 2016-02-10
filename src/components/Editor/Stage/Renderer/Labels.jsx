import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

const LABEL_HEIGHT = 18;
const FONT_SIZE_CORRECTION = 2;
const FONT_SIZE = LABEL_HEIGHT - FONT_SIZE_CORRECTION;
const CHARACTER_LABEL_POSITION = 8;
const CONTEXT_LABEL_POSITION = 5;
const CONTEXT_LABEL_OFFSET = 0.5;
const CORE_LABEL_POSITION = 2.5;

export class Labels extends Component {

  render() {
    const {scaleFactor} = this.props;

    const labels = [];

    ForceFieldAnatomy.QUADRANTS.forEach((quadrant) => {
      const leftAligned = quadrant.coefficient.x > 0 ? 'start' : 'end';
      const rightAligned = quadrant.coefficient.x < 0 ? 'start' : 'end';

      let x = CHARACTER_LABEL_POSITION * quadrant.coefficient.x * scaleFactor;
      let y = - CHARACTER_LABEL_POSITION * quadrant.coefficient.y * scaleFactor;
      const paddingX = quadrant.coefficient.x > 0 ? LABEL_HEIGHT / 2 : - LABEL_HEIGHT / 2;
      let paddingY = quadrant.coefficient.y > 0 ? - LABEL_HEIGHT / 2 : LABEL_HEIGHT;

      labels.push(
        <text key={uuid.v1()}
          className={`Labels-character Labels-${quadrant.name}`}
          x={x}
          y={y}
          dx={paddingX}
          dy={paddingY}
          fontSize={FONT_SIZE}
          textAnchor={leftAligned}>
          {quadrant.name}
        </text>
      );

      x = (CONTEXT_LABEL_POSITION - CONTEXT_LABEL_OFFSET) * quadrant.coefficient.x * scaleFactor;
      y = - (CONTEXT_LABEL_POSITION + CONTEXT_LABEL_OFFSET) * quadrant.coefficient.y * scaleFactor;
      paddingY = quadrant.coefficient.y > 0 ? 0 : LABEL_HEIGHT / 2;
      labels.push(
        <text key={uuid.v1()}
          filter="url(#solid)"
          className={`Labels-context Labels-${quadrant.labels[0]}`}
          x={x}
          y={y}
          dx={0}
          dy={paddingY}
          fontSize={FONT_SIZE}
          textAnchor={rightAligned}>
          {quadrant.labels[0]}
        </text>
      );

      x = (CONTEXT_LABEL_POSITION + CONTEXT_LABEL_OFFSET) * quadrant.coefficient.x * scaleFactor;
      y = - (CONTEXT_LABEL_POSITION - CONTEXT_LABEL_OFFSET) * quadrant.coefficient.y * scaleFactor;
      paddingY = quadrant.coefficient.y > 0 ? LABEL_HEIGHT / 2 : 0;
      labels.push(
        <text key={uuid.v1()}
          filter="url(#solid)"
          className={`Labels-context Labels-${quadrant.labels[1]}`}
          x={x}
          y={y}
          dx={0}
          dy={paddingY}
          fontSize={FONT_SIZE}
          textAnchor={leftAligned}>
          {quadrant.labels[1]}
        </text>
      );

      x = CORE_LABEL_POSITION * quadrant.coefficient.x * scaleFactor;
      y = - CORE_LABEL_POSITION * quadrant.coefficient.y * scaleFactor;
      const middlePaddingFactor = 4;
      paddingY = LABEL_HEIGHT / middlePaddingFactor;
      labels.push(
        <text key={uuid.v1()}
          className={`Labels-core Labels-${quadrant.labels[2]}`}
          x={x}
          y={y}
          dx={0}
          dy={paddingY}
          fontSize={FONT_SIZE}
          textAnchor='middle'>
          {quadrant.labels[2]}
        </text>
      );

    });

    return (
      <g id="Labels" className="Labels">
        {labels}
      </g>
    );
  }

}

Labels.propTypes = {
  scaleFactor: PropTypes.number.isRequired,
};

Labels.defaultProps = {
  scaleFactor: 1,
};
