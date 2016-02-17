import React, {Component, PropTypes} from 'react';
import Vector from 'victor';
import ForceFieldAnatomy from '../../../../ForceFieldAnatomy';

function convertPointsToScaledSvgPath(points, scaleFactor) {
  return points.map((point) => {
    point.multiplyScalarX(scaleFactor).multiplyScalarY(-scaleFactor);
    return `${point.x},${point.y}`;
  }).join(' ');
}

export class Areas extends Component {

  render() {
    const {
      scaleFactor,
      coreWidth, contextWidth, centerCircleRadius, contextMarkerSize,
    } = this.props;

    const groups = [];

    const side = coreWidth * scaleFactor;

    groups.push(
      <g key={'core'} className={'Areas-core'}>
        <rect className={'Areas-core Areas-problem'}
          x={0} y={-side} width={side} height={side} />
        <rect className={'Areas-core Areas-competition'}
          x={0} y={0} width={side} height={side} />
        <rect className={'Areas-core Areas-solution'}
          x={-side} y={0} width={side} height={side} />
        <rect className={'Areas-core Areas-uniqueness'}
          x={-side} y={-side} width={side} height={side} />
      </g>
    );

    const gridContextPoints1 = convertPointsToScaledSvgPath(
      [
        new Vector(0, coreWidth),
        new Vector(0, (contextWidth + contextMarkerSize)),
        new Vector(contextWidth, (contextWidth + contextMarkerSize)),
        new Vector(contextWidth, contextWidth),
        new Vector(coreWidth, coreWidth),
      ],
      scaleFactor,
    );
    const gridContextPoints2 = convertPointsToScaledSvgPath(
      [
        new Vector(coreWidth, coreWidth),
        new Vector(contextWidth, contextWidth),
        new Vector((contextWidth + contextMarkerSize), contextWidth),
        new Vector((contextWidth + contextMarkerSize), 0),
        new Vector(coreWidth, 0),
      ],
      scaleFactor,
    );

    groups.push(ForceFieldAnatomy.QUADRANTS.map((quadrant) => {
      const deg = quadrant.deg;
      const transform = `rotate(${deg})`;

      let labelIndex1 = 0;
      let labelIndex2 = 1;
      if (deg === 90 || deg === 270) {
        labelIndex1 = 1;
        labelIndex2 = 0;
      }

      return (
        <g key={`${deg}'-1'`} transform={transform}>
          <polygon className={`Areas-context Areas-${quadrant.labels[labelIndex1]}`}
            points={gridContextPoints1} />
          <polygon className={`Areas-context Areas-${quadrant.labels[labelIndex2]}`}
            points={gridContextPoints2} />
        </g>
      );

    }));

    return (
      <g id="Areas" className="Areas" fill='none'>
        {groups}
      </g>
    );
  }

}

Areas.propTypes = {
  scaleFactor: PropTypes.number,
  contextWidth: PropTypes.number,
  coreWidth: PropTypes.number,
  centerCircleRadius: PropTypes.number,
  contextMarkerSize: PropTypes.number,
};

Areas.defaultProps = {
  scaleFactor: 1,
  contextWidth: 8,
  coreWidth: 5,
  centerCircleRadius: Math.sqrt(2),
  contextMarkerSize: 0.5,
};
