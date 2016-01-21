import React, {Component} from 'react';
import PropTypes from 'PropTypes';

export default class DefsComponent extends Component {

  render() {
    return this.renderDef(this.props.gridUnit, this.props.offset, this.props.origin);
  }
}

DefsComponent.propTypes = {
  gridUnit: PropTypes.number.isRequired,
  offset: PropTypes.point.isRequired,
};