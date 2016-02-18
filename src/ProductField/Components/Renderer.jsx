import React, {Component} from 'react';

import PropTypes from '../PropTypes';
import ForceFieldAnatomy from '../ForceFieldAnatomy';

import {Marker} from './Marker';
import {Lines} from './Lines';
import {Labels} from './Labels';
import {Grid} from './Grid';
import {Areas} from './Areas';
import {Forces} from './Forces';

import {Crosshatch, Stripe, Dots} from './Definitions/Patterns';
import {Circle} from './Definitions/Masks';
import {Solid} from './Definitions/Filters';
import {Arrow} from './Definitions/Symbols';

export const defaultVisibility = ['Grid', 'Marker', 'Lines', 'Areas', 'Labels', 'Forces'];

export class Renderer extends Component {

  rendererStyles() {
    return {
      backgroundColor: this.props.skin.background,
    };
  }

  isVisible(name) {
    const indexNotExist = -1;
    return (this.props.visibility.indexOf(name) !== indexNotExist);
  }

  render() {
    const {
      width, height, gridUnit, scaleFactor, skin,
      minLengthForArrowsToDisplay, triangleSize, energies,
      highlights, labels, lines, dots,
    } = this.props;

    const classNames = [];
    highlights.forEach((name) => {
      classNames.push(`highlight-${name}`);
    });

    labels.forEach((name) => {
      classNames.push(`label-${name}`);
    });
    lines.forEach((name) => {
      classNames.push(`line-${name}`);
    });
    const className = classNames.join(' ');

    const origin = {x: Math.floor(width / 2), y: Math.floor(height / 2)};

    const defsProps = {
      gridUnit: scaleFactor,
      origin,
      size: {width, height},
    };

    return (
      <svg
        className={className}
        style={this.rendererStyles()}
        width={width}
        height={height}
        viewBox={`-${origin.x} -${origin.y} ${width} ${height}`} >
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
            <rect
              x={-width/2}
              y={-height/2}
              width={width + scaleFactor/2}
              height={height + scaleFactor/2}
              fill="url(#dots)"
              transform={ `translate(-${scaleFactor/2} -${scaleFactor/2})`}/>
            <Grid
              gridUnit={gridUnit}
              scaleFactor={scaleFactor}
              dotsPerSide={ForceFieldAnatomy.DOTS_PER_SIDE}
              skin={skin}
              dots={dots}/>
          </g>
          : null }
        { this.isVisible('Marker') ?
          <Marker
            scaleFactor={scaleFactor}
            contextWidth={ForceFieldAnatomy.CONTEXT_WIDTH}
            coreWidth={ForceFieldAnatomy.CORE_WIDTH}
            centerCircleRadius={ForceFieldAnatomy.CENTER_RADIUS}
            contextMarkerSize={ForceFieldAnatomy.CONTEXT_MARKER_SIZE}
            skin={skin} />
        : null }
        { this.isVisible('Lines') ?
          <Lines
            scaleFactor={scaleFactor}
            contextWidth={ForceFieldAnatomy.CONTEXT_WIDTH}
            coreWidth={ForceFieldAnatomy.CORE_WIDTH}
            centerCircleRadius={ForceFieldAnatomy.CENTER_RADIUS}
            contextMarkerSize={ForceFieldAnatomy.CONTEXT_MARKER_SIZE}
            lineColor={skin.lines} />
        : null }
        { this.isVisible('Areas') ?
          <Areas scaleFactor={scaleFactor} />
          : null }
        { this.isVisible('Labels') ?
          <Labels scaleFactor={scaleFactor} />
          : null }
        { this.isVisible('Forces') ?
          <Forces
            energies={energies}
            gridUnit={gridUnit}
            scaleFactor={scaleFactor}
            arrowsPerSide={ForceFieldAnatomy.ARROWS_PER_SIDE}
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
  gridUnit: PropTypes.number.isRequired,
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
    negativeArrow: PropTypes.string.isRequired,
    positiveArrow: PropTypes.string.isRequired,
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
