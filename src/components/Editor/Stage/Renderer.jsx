import React, {Component} from 'react';
import PropTypes from 'PropTypes';

import {Marker} from './Renderer/Marker';
import {Lines} from './Renderer/Lines';
import {Labels} from './Renderer/Labels';
import {Grid} from './Renderer/Grid';
import {Areas} from './Renderer/Areas';
import {Forces} from './Renderer/Forces';

import {Crosshatch, Stripe, Dots} from './Renderer/Defs/Patterns';
import {Circle} from './Renderer/Defs/Masks';
import {Solid} from './Renderer/Defs/Filters';
import {Arrow} from './Renderer/Defs/Symbols';

import {allowCustomAttributes} from 'utils';
import DOMProperty from 'react/lib/DOMProperty';

allowCustomAttributes(DOMProperty, ['mask', 'maskUnits']);

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

    const defsProps = {
      gridUnit,
      offset: {x: offsetX, y: offsetY},
      origin,
      size: {width, height},
    }

    return (
      <svg
        className={className}
        style={this.rendererStyles()}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`} >
        <defs>
          <Solid {...defsProps} />
          <Circle {...defsProps} />
          <Crosshatch {...defsProps} />
          <Stripe {...defsProps} />
          <Dots {...defsProps} />
          <Arrow {...defsProps} />
        </defs>
        { this.isVisible('Grid') ?
          <g>
            <rect mask={"url(#circle)"} width={width} height={height} fill="url(#dots)" />
              <Grid
                origin={origin}
                gridUnit={gridUnit}
                skin={skin}
                dots={dots}/>
          </g>
          : null }
        { this.isVisible('Marker') ?
          <Marker
            origin={origin}
            gridUnit={gridUnit}
            skin={skin} />
        : null }
        { this.isVisible('Lines') ?
          <Lines
            origin={origin}
            gridUnit={gridUnit}/>
        : null }
        { this.isVisible('Areas') ?
          <Areas
            origin={origin}
            gridUnit={gridUnit} />
          : null }
        { this.isVisible('Labels') ?
          <Labels
            origin={origin}
            gridUnit={gridUnit}
            skin={skin} />
          : null }
        { this.isVisible('Forces') ?
          <Forces
            stageWidth={width}
            stageHeight={height}
            fieldSize={fieldSize}
            energies={energies}
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
  isPresentationModeEnabled: PropTypes.bool,
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
  isPresentationModeEnabled: false,
  width: 600,
  height: 600,
  energies: Forces.defaultProps.energies,
  dots: [],
  highlights: ['all'],
  labels: ['all'],
  lines: ['all'],
  visibility: defaultVisibility,
};
