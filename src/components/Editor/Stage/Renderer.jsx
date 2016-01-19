import React, {Component, PropTypes} from 'react';

import {Marker} from './Renderer/Marker';
import {Lines} from './Renderer/Lines';
import {Labels, getDefs as getLabelDefs} from './Renderer/Labels';
import {Grid} from './Renderer/Grid';
import {Areas, getDefs as getAreaDefs} from './Renderer/Areas';
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
      minLengthForArrowsToDisplay, triangleSize, energies, highlights,
      labels,
    } = this.props;

    let classNames = [];
    highlights.forEach(function(name) {
      classNames.push('highlight-' + name);
    });

    labels.forEach(function(name) {
      classNames.push('label-' + name);
    });
    let className = classNames.join(' ');

    let defs = getAreaDefs().concat(getLabelDefs());

    return (
      <svg
        className={className}
        style={this.rendererStyles()}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`} >
        <defs>{defs}</defs>
        { this.props.visibility.grid ?
          <Grid
            stageWidth={width}
            stageHeight={height}
            gridUnit={gridUnit}
            skin={skin}
            dots={this.props.dots}
            highlights={highlights} />
          : null }
        <Marker
          stageWidth={width}
          stageHeight={height}
          fieldSize={fieldSize}
          gridUnit={gridUnit}
          skin={skin} />
        <Lines
          stageWidth={this.props.width}
          stageHeight={this.props.height}
          gridUnit={this.props.gridUnit}/>
        <Areas
          stageWidth={this.props.width}
          stageHeight={this.props.height}
          gridUnit={this.props.gridUnit} />
        { this.props.visibility.labels ?
          <Labels
            stageWidth={this.props.width}
            stageHeight={this.props.height}
            gridUnit={this.props.gridUnit}
            skin={this.props.skin} />
          : null }
        { this.props.visibility.forces ?
          <Forces
            energies={energies}
            stageWidth={width}
            stageHeight={height}
            fieldSize={fieldSize}
            gridUnit={gridUnit}
            normalizeCoordinates={normalizeCoordinates}
            arrowTriangleSize={triangleSize}
            minArrowLength={minLengthForArrowsToDisplay}
            skin={skin}
          />
        : null }
      </svg>
    );
  }
}

Renderer.propTypes = {
  energies: Forces.propTypes.energies,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
  triangleSize: PropTypes.number.isRequired,
  minLengthForArrowsToDisplay: PropTypes.number.isRequired,
  lables: React.PropTypes.arrayOf(PropTypes.string),
  visibility: PropTypes.shape({
    forces: PropTypes.bool.isRequired,
    grid: PropTypes.bool.isRequired,
    labels: PropTypes.bool.isRequired,
  }),
  highlights: PropTypes.arrayOf(PropTypes.string),
  skin: PropTypes.shape({
    background: PropTypes.string.isRequired,
    dots: PropTypes.string.isRequired,
    marker: PropTypes.string.isRequired,
    arrows: PropTypes.string.isRequired,
  }).isRequired,
  dots: PropTypes.arrayOf(PropTypes.string),
};

Renderer.defaultProps = {
  energies: Forces.defaultProps.energies,
  visibility: {forces: true, labels: true, grid: true},
  highlights: [],
  labels: [],
  dots: [],
};
