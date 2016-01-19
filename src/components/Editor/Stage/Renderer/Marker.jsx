import React, {Component, PropTypes} from 'react';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

export class Marker extends Component {

  render() {
    const {stageWidth, stageHeight, fieldSize, gridUnit, skin: {marker}} = this.props;
    const origin = {x: stageWidth / 2, y: stageHeight / 2};
    const circleRadius = ForceFieldAnatomy.CENTER_RADIUS;

    const characterMarkerCoordinates = [
      8 * gridUnit + 1/2 * gridUnit,
      -8 * gridUnit,
      8 * gridUnit,
      -8 * gridUnit,
      8 * gridUnit,
      -8 * gridUnit - 1/2 * gridUnit
    ].join()

    let groups = [];

    const gu5 = 5 * gridUnit;

    ForceFieldAnatomy.QUADRANTS.forEach(function(quadrant) {

      const deg = quadrant.deg;
      const transform = `rotate(${deg})`;

      groups.push(
        <g key={deg} transform={transform}>
          <polyline points={characterMarkerCoordinates} strokeWidth='3' fill='none' stroke={marker} />
          <circle r={6} cx={gu5} cy={-gu5} fill={marker} />
        </g>
      );

    });

    groups.push(
      <circle key={'circle'} cx={0} cy={0} r={circleRadius * gridUnit} fill='none' strokeWidth='3' stroke={marker} />
    )

    let transform = 'translate(' + origin.x + ',' + origin.y + ')';
    return <g id="Marker" className="Marker" transform={transform}>{groups}</g>;
  }
}

Marker.propTypes = {
  stageWidth: PropTypes.number.isRequired,
  stageHeight: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    marker: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.object,
};

Marker.defaultProps = {
  style: {},
};
