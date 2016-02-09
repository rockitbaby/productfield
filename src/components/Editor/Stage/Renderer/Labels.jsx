import React, {Component} from 'react';
import uuid from 'node-uuid';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import PropTypes from '../../../../PropTypes';

const LABEL_HEIGHT = 18;

export class Labels extends Component {

  render() {
    const {gridUnit} = this.props;

    const labels = [];

    ForceFieldAnatomy.QUADRANTS.forEach((quadrant) => {
      const leftAligned = quadrant.coefficient.x > 0 ? 'start' : 'end';
      const rightAligned = quadrant.coefficient.x < 0 ? 'start' : 'end';

      let x = 8 * quadrant.coefficient.x;
      let y = 8 * quadrant.coefficient.y;
      let considerHeight = quadrant.coefficient.y > 0 ? 0 : 0.5;

      labels.push(
        <text key={uuid.v1()}
          className={`Labels-character Labels-${quadrant.name}`}
          x={x * gridUnit}
          y={-y * gridUnit + considerHeight * LABEL_HEIGHT}
          textAnchor={leftAligned}>
          {quadrant.name}
        </text>
      );

      x = 4.5 * quadrant.coefficient.x;
      y = 5.5 * quadrant.coefficient.y;
      considerHeight = quadrant.coefficient.y > 0 ? 0 : 0.5;
      labels.push(
        <text key={uuid.v1()}
          filter="url(#solid)"
          className={`Labels-context Labels-${quadrant.labels[0]}`}
          x={x * gridUnit}
          y={-y * gridUnit + considerHeight * LABEL_HEIGHT}
          textAnchor={rightAligned}>
          {quadrant.labels[0]}
        </text>
      );

      x = 5.5 * quadrant.coefficient.x;
      y = 4.5 * quadrant.coefficient.y;
      considerHeight = quadrant.coefficient.y > 0 ? 0.5 : 0;
      labels.push(
        <text key={uuid.v1()}
          filter="url(#solid)"
          className={`Labels-context Labels-${quadrant.labels[1]}`}
          x={x * gridUnit}
          y={-y * gridUnit + considerHeight * LABEL_HEIGHT}
          textAnchor={leftAligned}>
          {quadrant.labels[1]}
        </text>
      );

      x = 2.5 * quadrant.coefficient.x;
      y = 2.5 * quadrant.coefficient.y;
      considerHeight = quadrant.coefficient.y > 0 ? 0 : 0.5;
      labels.push(
        <text key={uuid.v1()}
          className={`Labels-core Labels-${quadrant.labels[2]}`}
          x={x * gridUnit}
          y={-y * gridUnit + considerHeight * LABEL_HEIGHT}
          textAnchor='middle'>
          {quadrant.labels[2]}
        </text>
      );

    });

    return <g id="Labels" className="Labels">{labels}</g>;
  }

}

Labels.propTypes = {
  gridUnit: PropTypes.number.isRequired,
};
