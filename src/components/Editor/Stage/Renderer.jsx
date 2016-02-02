import React, {Component, PropTypes} from 'react';

import {Marker} from './Renderer/Marker';
import {Grid} from './Renderer/Grid';
import {Forces} from './Renderer/Forces';

export class Renderer extends Component {

  rendererStyles() {
    return {
      height: this.props.height,
      width: '100%',
      backgroundColor: this.props.skin.background
    }
  }

  render() {
    const {
      width, height, fieldSize, gridUnit, skin, normalizeCoordinates,
      minLengthForArrowsToDisplay, triangleSize
    } = this.props;
    return (
      <svg style={this.rendererStyles()} >
        <Grid
          stageWidth={width}
          stageHeight={height}
          fieldSize={fieldSize}
          gridUnit={gridUnit}
          normalizeCoordinates={normalizeCoordinates}
          skin={skin} />
        <Marker
          stageWidth={width}
          stageHeight={height}
          fieldSize={fieldSize}
          gridUnit={gridUnit}
          skin={skin} />
        <Forces
          stageWidth={width}
          stageHeight={height}
          fieldSize={fieldSize}
          gridUnit={gridUnit}
          normalizeCoordinates={normalizeCoordinates}
          arrowTriangleSize={triangleSize}
          minArrowLength={minLengthForArrowsToDisplay}
          skin={skin}
        />
      </svg>
    );
  }
}

Renderer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
  triangleSize: PropTypes.number.isRequired,
  minLengthForArrowsToDisplay: PropTypes.number.isRequired,
  skin: PropTypes.shape({
    background: PropTypes.string.isRequired,
    dots: PropTypes.string.isRequired,
    marker: PropTypes.string.isRequired,
    arrows: PropTypes.string.isRequired,
  }).isRequired,
};
