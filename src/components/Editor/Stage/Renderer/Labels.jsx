import React, {Component} from 'react';
import uuid from 'node-uuid';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import PropTypes from '../../../../PropTypes';

const LABEL_HEIGHT = 18;

export class Labels extends Component {

  render() {
    const {origin, gridUnit, skin: {dots}} = this.props;

    let labels = [];

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant) {

      let x = 8 * quadrant.coefficient.x;
      let y = 8 * quadrant.coefficient.y;
      let textAnchor = quadrant.coefficient.x > 0 ? 'start' : 'end';
      let considerHeight = quadrant.coefficient.y > 0 ? 0 : 0.5;

      labels.push(<text key={uuid.v1()} className={`Labels-character Labels-${quadrant.name}`} x={x * gridUnit} y={-y * gridUnit + considerHeight * LABEL_HEIGHT} textAnchor={textAnchor}>{quadrant.name}</text>)

      x = 4.5 * quadrant.coefficient.x;
      y = 5.5 * quadrant.coefficient.y;
      textAnchor = quadrant.coefficient.x > 0 ? 'end' : 'start';
      considerHeight = quadrant.coefficient.y > 0 ? 0 : 0.5;
      labels.push(<text key={uuid.v1()} filter="url(#solid)" className={`Labels-context Labels-${quadrant.labels[0]}`} x={x * gridUnit} y={-y * gridUnit + considerHeight * LABEL_HEIGHT} textAnchor={textAnchor}>{quadrant.labels[0]}</text>)

      x = 5.5 * quadrant.coefficient.x;
      y = 4.5 * quadrant.coefficient.y;
      textAnchor = quadrant.coefficient.x > 0 ? 'start' : 'end';
      considerHeight = quadrant.coefficient.y > 0 ? 0.5 : 0;
      labels.push(<text key={uuid.v1()} filter="url(#solid)" className={`Labels-context Labels-${quadrant.labels[1]}`} x={x * gridUnit} y={-y * gridUnit + considerHeight * LABEL_HEIGHT} textAnchor={textAnchor}>{quadrant.labels[1]}</text>)

      x = 2.5 * quadrant.coefficient.x;
      y = 2.5 * quadrant.coefficient.y;
      considerHeight = quadrant.coefficient.y > 0 ? 0 : 0.5;
      textAnchor = 'middle';
      labels.push(<text key={uuid.v1()} className={`Labels-core Labels-${quadrant.labels[2]}`} x={x * gridUnit} y={-y * gridUnit + considerHeight * LABEL_HEIGHT} textAnchor={textAnchor}>{quadrant.labels[2]}</text>)

    });

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Labels" className="Labels" transform={transform}>{labels}</g>;
  }

}

Labels.propTypes = {
  origin: PropTypes.point.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
};
