import React, {Component, PropTypes} from 'react';

import {Marker, getDefs as getMarkerDefs} from './Renderer/Marker';
import {Lines} from './Renderer/Lines';
import {Labels, getDefs as getLabelDefs} from './Renderer/Labels';
import {Grid, getDefs as getGridDefs} from './Renderer/Grid';
import {Areas, getDefs as getAreaDefs} from './Renderer/Areas';
import {Forces} from './Renderer/Forces';
import DOMProperty from 'react/lib/DOMProperty';

const customAttributes = ['mask', 'maskUnits'];

DOMProperty.injection.injectDOMPropertyConfig({
  isCustomAttribute: function (attributeName) {
    return (customAttributes.indexOf(attributeName) !== -1);
  }
});

export const defaultVisibility = ['Grid', 'Marker', 'Lines', 'Areas', 'Labels', 'Forces'];

export class Renderer extends Component {

  rendererStyles() {
    return {
      height: this.props.height,
      width: '100%',
      backgroundColor: this.props.skin.background
    }
  }

  isVisible(name) {
    return (this.props.visibility.indexOf(name) != -1);
  }

  render() {
    const {
      width, height, fieldSize, gridUnit, skin, normalizeCoordinates,
      minLengthForArrowsToDisplay, triangleSize, energies,
      highlights, labels, lines, dots,
    } = this.props;

    let classNames = [];
    highlights.forEach(function(name) {
      classNames.push('highlight-' + name);
    });

    labels.forEach(function(name) {
      classNames.push('label-' + name);
    });
    lines.forEach(function(name) {
      classNames.push('line-' + name);
    });
    let className = classNames.join(' ');

    const origin = {x: Math.floor(width / 2), y: Math.floor(height / 2)};
    const offsetX = Math.floor(width / 2 - fieldSize / 2) % gridUnit
    const offsetY = Math.floor(height / 2 - fieldSize / 2) % gridUnit

    const defs = getAreaDefs()
      .concat(getLabelDefs())
      .concat(getGridDefs(gridUnit, offsetX, offsetY))
      .concat(getMarkerDefs(gridUnit, origin, width, height));

    return (
      <svg
        className={className}
        style={this.rendererStyles()}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`} >
        <defs>{defs}</defs>
        { this.isVisible('Grid') ?
          <g>
            <rect width={width} height={height} fill="url(#dots)" />
              <Grid
                stageWidth={width}
                stageHeight={height}
                gridUnit={gridUnit}
                skin={skin}
                dots={dots}/>
          </g>
          : null }
        { this.isVisible('Marker') ?
          <Marker
            stageWidth={width}
            stageHeight={height}
            fieldSize={fieldSize}
            gridUnit={gridUnit}
            skin={skin} />
        : null }
        { this.isVisible('Lines') ?
          <Lines
            stageWidth={width}
            stageHeight={height}
            gridUnit={gridUnit}/>
        : null }
        { this.isVisible('Areas') ?
          <Areas
            stageWidth={width}
            stageHeight={height}
            gridUnit={gridUnit} />
          : null }
        { this.isVisible('Labels') ?
          <Labels
            stageWidth={width}
            stageHeight={height}
            gridUnit={gridUnit}
            skin={skin} />
          : null }
        { this.isVisible('Forces') ?
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
  width: PropTypes.number,
  height: PropTypes.number,
  fieldSize: PropTypes.number.isRequired,
  gridUnit: PropTypes.number.isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
  triangleSize: PropTypes.number.isRequired,
  minLengthForArrowsToDisplay: PropTypes.number.isRequired,
  labels: React.PropTypes.arrayOf(PropTypes.string),
  lines: React.PropTypes.arrayOf(PropTypes.string),
  visibility: React.PropTypes.arrayOf(PropTypes.string),
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
  width: 600,
  height: 600,
  energies: Forces.defaultProps.energies,
  dots: [],
  highlights: ['all'],
  labels: ['all'],
  lines: ['all'],
  visibility: defaultVisibility,
};
