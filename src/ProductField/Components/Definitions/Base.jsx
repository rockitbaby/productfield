import React, {Component} from 'react';
import PropTypes from '../../PropTypes';

export default class DefsComponent extends Component {

  render() {
    const {gridUnit, origin, size} = this.props;
    const offsetX = Math.floor(size.width / 2) % gridUnit;
    const offsetY = Math.floor(size.height / 2) % gridUnit;
    return this.renderDef(
      gridUnit,
      {x: offsetX, y: offsetY},
      origin,
      size,
    );
  }
}

DefsComponent.propTypes = {
  gridUnit: PropTypes.number.isRequired,
  origin: PropTypes.point.isRequired,
  size: PropTypes.size.isRequired,
};
