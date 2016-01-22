import React, {Component} from 'react';
import Vector from 'victor';
import {ForceFieldCalculator} from './ForceFieldCalculator';
import {ForceArrow} from './ForceArrow';
import PropTypes from '../../../../PropTypes';
import ForceFieldDescriptor from 'ForceFieldDescriptor';

export class Forces extends Component {

  render() {
    const {origin, gridUnit, energies} = this.props;

    const arrows = [];
    const forceCalculator = new ForceFieldCalculator(energies);

    Anatomy.QUADRANTS.forEach((quadrant) => {
      for(let ix = 0; ix <= Anatomy.DOTS_PER_SIDE; ix++) {
        for(let iy = 0; iy <= Anatomy.DOTS_PER_SIDE; iy++) {

          const x = quadrant.coefficient.x * ix;
          const y = quadrant.coefficient.y * iy;
          const TEN = 10;
          const forceFieldDescriptor = new ForceFieldDescriptor(x / TEN, y / TEN);

          let radius = 0.5;
          const classNames = forceFieldDescriptor.getClassNames();
          const names = new Set(forceFieldDescriptor.getNames());

          const force = forceCalculator.forceVectorAtPoint(x / TEN, y / TEN);

          arrows.push(<use xlinkHref={"#arrow"} key={`${quadrant.deg}:${x},${y}`} x={x * gridUnit} y={-y * gridUnit} />);

        }
      }
    })

    const transform = `translate(${origin.x},${origin.y})`;
    return <g id="Forces" className="Forces" transform={transform}>{arrows}</g>;

  }
}

Forces.propTypes = {
  origin: PropTypes.point.isRequired,
  energies: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    strength: PropTypes.number.isRequired,
  })),
  gridUnit: PropTypes.number.isRequired,
  arrowTriangleSize: PropTypes.number,
  minArrowLength: PropTypes.number,
  skin: PropTypes.shape({
    negativeArrow: PropTypes.string.isRequired,
    positiveArrow: PropTypes.string.isRequired,
  }).isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
};

Forces.defaultProps = {
  energies: [],
  arrowTriangleSize: 4,
  minArrowLength: 0,
};
