import React, {Component, PropTypes} from 'react';
import uuid from 'node-uuid';
import ForceFieldDescriptor from '../../../../ForceFieldDescriptor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';
import DOMProperty from 'react/lib/DOMProperty';

DOMProperty.injection.injectDOMPropertyConfig({
  isCustomAttribute: function (attributeName) {
    return (attributeName === 'filter' || 'flood-color');
  }
});

const LABEL_HEIGHT = 18;

export function getDefs() {
  return [
    <filter key="lables-defs-filter" x="-0.1" y="-0.1" width="1.2" height="1.2" id="solid">
      <feFlood flood-color="white"/>
      <feComposite in="SourceGraphic"/>
    </filter>
  ];
}

export class Labels extends Component {

  render() {
    const {stageWidth, stageHeight, gridUnit, skin: {dots}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};

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
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    dots: PropTypes.string.isRequired,
  }).isRequired,
};
