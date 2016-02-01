import React, {Component, PropTypes} from 'react';
import {Energy} from './Energy';
import {ConnectedEnergy} from '../../../state/components/ConnectedEnergy';
import {Renderer} from './Renderer';
import '../../../styles/main.css';

const FORCE_ARROW_HEAD_SIZE = 2.5;
const MIN_FORCE_ARROW_LENGTH = 2;

export class Stage extends Component {

  getProperties() {
    const dotsInField = 20;
    const maximumFieldSize = Math.floor(Math.min(this.props.width, this.props.height)) - 50;
    const gridUnit = Math.floor(maximumFieldSize / dotsInField);
    const fieldSize = gridUnit * dotsInField

    const lightSkin =  {
                     dots:   "#304FFE",
                     marker: "#304FFE",
                     arrows: "#FF0000",
                     background: '#FFFFFF'
                   };
    const darkSkin =  {
                     dots:   "#FFFFFF",
                     marker: "#FFFFFF",
                     arrows: "#F2F2F2",
                     background: '#000000'
                   };

    return {
      fieldSize: fieldSize,
      gridUnit: gridUnit,
      triangleSize: FORCE_ARROW_HEAD_SIZE,
      minLengthForArrowsToDisplay: MIN_FORCE_ARROW_LENGTH,
      width:  this.props.width,
      height: this.props.height,
      skin: this.props.isPresentation ? darkSkin : lightSkin
    }
  }

  deNormalizeOneCoordinate(val, isY) {
    var properties = this.getProperties();

    var deNormalizedVal = (val * properties.fieldSize) / 2;
    var deTranslatedVal = deNormalizedVal;

    if(isY) {
      deTranslatedVal = deNormalizedVal - properties.height / 2;
      deTranslatedVal = deTranslatedVal * -1;
    } else {
      deTranslatedVal = deTranslatedVal + properties.width / 2;
    }

    // return deTranslatedVal;
    return deTranslatedVal;
  }

  deNormalizeCoordinates(x, y) {
    return [this.deNormalizeOneCoordinate(x, false), this.deNormalizeOneCoordinate(y, true)];
  }

  normalizeCoordinates(x, y) {
    var properties = this.getProperties();

    var translatedX = (x - properties.width / 2);
    var translatedY = (y - properties.height / 2);

    var normalizedX = (2 * translatedX) / properties.fieldSize;
    var normalizedY = -(2 * translatedY) / properties.fieldSize;

    return [normalizedX, normalizedY];
  }

  addEnergy(event) {
    event.preventDefault();
    const stage = event.currentTarget;
    var pXstage = event.pageX - stage.offsetLeft;
    var pYstage = event.pageY - stage.offsetTop;

    var [normalizedX, normalizedY] = this.normalizeCoordinates(pXstage, pYstage);

    this.props.addEnergy({x: normalizedX, y: normalizedY, strength: 1});
  }

  getForceFieldStyle() {
    return {
      position: 'relative',
      margin: '0 auto',
      width: '100%',
      height: '100%',
      transition: 'width 0.2s, height 0.2s',
    }
  }

  render() {
    var forceFieldStyle = this.getForceFieldStyle();

    var rendererProps = Object.assign(this.getProperties(), {
      normalizeCoordinates: this.normalizeCoordinates.bind(this),
      deNormalizeCoordinates: this.deNormalizeCoordinates.bind(this),
      isPresentation: this.props.isPresentation
    })

    var className = 'ForceFieldStage';
    if (this.props.dragging) {
      className += ' is-Dragging';
    }

    return <div className={className} onDoubleClick={this.addEnergy.bind(this)} style={{position: 'relative'}}>
      <Renderer {...rendererProps} />
      {this.props.energies.map(energy =>
        <ConnectedEnergy key={energy.id}
                         id={energy.id}
                         stageWidth={this.props.width}
                         stageHeight={this.props.height}
                         normalizeCoordinates={this.normalizeCoordinates.bind(this)}
                         deNormalizeCoordinates={this.deNormalizeCoordinates.bind(this)} />
      )}
    </div>;
  }
}

Stage.propTypes = {
  energies: PropTypes.arrayOf(PropTypes.shape({
    id: Energy.propTypes.id,
    x: Energy.propTypes.x,
    y: Energy.propTypes.y,
    strength: Energy.propTypes.strength,
    isMuted: Energy.propTypes.isMuted,
  })),
};

Stage.defaultProps = {
  energies: [],
};
