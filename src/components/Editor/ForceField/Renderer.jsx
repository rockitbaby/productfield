import React, {Component, PropTypes} from 'react';

import {Marker} from './Renderer/Marker';
import {Grid} from './Renderer/Grid';
import {Forces} from './Renderer/Forces';

export class Renderer extends Component {

  constructor(props) {
    super(props);
    this.showForces = true;
  }

  renderForces() {
    if (this.showForces) {
      return (
        <Forces
          stageWidth={this.props.width}
          stageHeight={this.props.height}
          fieldSize={this.props.fieldSize}
          gridUnit={this.props.gridUnit}
          normalizeCoordinates={this.props.normalizeCoordinates}
          skin={this.props.skin}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    var rendererStyles = this.getRendererStyle();

    return (
      <svg style={rendererStyles} >
        <Grid
          stageWidth={this.props.width}
          stageHeight={this.props.height}
          fieldSize={this.props.fieldSize}
          gridUnit={this.props.gridUnit}
          normalizeCoordinates={this.props.normalizeCoordinates}
          skin={this.props.skin} />
        <Marker
          stageWidth={this.props.width}
          stageHeight={this.props.height}
          fieldSize={this.props.fieldSize}
          gridUnit={this.props.gridUnit}
          skin={this.props.skin} />
        { this.renderForces() }
      </svg>
    );
  }

  getRendererStyle() {
    return {
      height: this.props.height,
      width: '100%',
      backgroundColor: this.props.skin.background
    }
  }
}

Renderer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
  skin: PropTypes.shape({
    background: PropTypes.string.isRequired,
    dots: PropTypes.string.isRequired,
    marker: PropTypes.string.isRequired,
    arrows: PropTypes.string.isRequired,
  }).isRequired,
};
