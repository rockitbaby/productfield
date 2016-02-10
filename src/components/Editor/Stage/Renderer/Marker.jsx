import React, {Component} from 'react';
import Vector from 'victor';
import PropTypes from '../../../../PropTypes';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

const CONTEXT_MARKER_WIDTH = 3;
const CORE_EDGE_MARKER_WIDTH = 6;
const CENTER_MARKER_WIDTH = 6;

export class Marker extends Component {

  render() {
    const {
      scaleFactor,
      contextWidth, coreWidth, centerCircleRadius, contextMarkerSize,
      skin: {marker},
    } = this.props;

    const characterMarkerCoordinates = [
      new Vector(
        contextWidth + contextMarkerSize,
        -contextWidth,
      ),
      new Vector(
        contextWidth,
        -contextWidth,
      ),
      new Vector(
        contextWidth,
        -contextWidth - contextMarkerSize,
      ),
    ].map((point) => {
      point.multiplyScalar(scaleFactor);
      return `${point.x},${point.y}`;
    }).join(' ');

    const groups = [];

    const coreRectEdge = coreWidth * scaleFactor;

    ForceFieldAnatomy.QUADRANTS.forEach((quadrant) => {

      const deg = quadrant.deg;
      const transform = `rotate(${deg})`;

      groups.push(
        <g key={deg} transform={transform}>
          <polyline points={characterMarkerCoordinates}
            strokeWidth={CONTEXT_MARKER_WIDTH} fill='none' stroke={marker} />
          <circle r={(1 / CORE_EDGE_MARKER_WIDTH) * scaleFactor}
            cx={coreRectEdge} cy={-coreRectEdge} fill={marker} />
        </g>
      );

    });

    groups.push(
      <circle key={'circle'}
        cx={0} cy={0} r={centerCircleRadius * scaleFactor}
        fill='none' strokeWidth={CENTER_MARKER_WIDTH} stroke={marker} />
    );

    return (
      <g id="Marker" className="Marker">
        {groups}
      </g>
    );
  }
}

Marker.propTypes = {
  scaleFactor: PropTypes.number.isRequired,
  contextWidth: PropTypes.number,
  coreWidth: PropTypes.number,
  centerCircleRadius: PropTypes.number,
  contextMarkerSize: PropTypes.number,
  skin: PropTypes.shape({
    marker: PropTypes.string.isRequired,
  }).isRequired,
};

Marker.defaultProps = {
  scaleFactor: 1,
  contextWidth: 8,
  coreWidth: 5,
  centerCircleRadius: Math.sqrt(2),
  contextMarkerSize: 0.5,
};
