import React, {Component, PropTypes} from 'react';
import {DraggableCore} from 'react-draggable';
import uuid from 'node-uuid';
import {Energy} from './Stage/Energy';
import {Renderer} from './Stage/Renderer';
import '../../styles/main.css';
import sliderStyles from './Stage/Energy/slider.css';
import energyStyles from './Stage/Energy/energy.css';

const FORCE_ARROW_HEAD_SIZE = 4;
const MIN_FORCE_ARROW_LENGTH = 2;
const DOTS_IN_FIELD = 20;

export class Stage extends Component {

  getProperties() {
    const maximumFieldSize = Math.floor(Math.min(this.props.width, this.props.height)) - 50;
    const gridUnit = Math.floor(maximumFieldSize / DOTS_IN_FIELD);
    const fieldSize = gridUnit * DOTS_IN_FIELD;

    const lightSkin =  {
                     dots:   "#304FFE",
                     marker: "#304FFE",
                     arrows: "#F2F2F2",
                     positiveArrow: "#008000",
                     negativeArrow: "#800000",
                     background: '#FFFFFF'
                   };
    const darkSkin =  {
                     dots:   "#FFFFFF",
                     marker: "#FFFFFF",
                     arrows: "#F2F2F2",
                     positiveArrow: "#008000",
                     negativeArrow: "#800000",
                     background: '#000000'
                   };

    return {
      fieldSize: fieldSize,
      gridUnit: gridUnit,
      triangleSize: FORCE_ARROW_HEAD_SIZE,
      minLengthForArrowsToDisplay: MIN_FORCE_ARROW_LENGTH,
      width:  this.props.width,
      height: this.props.height,
      skin: this.props.isPresentationModeEnabled ? darkSkin : lightSkin
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

  energyPositioningStyles(x, y) {
    const [pixelatedX, pixelatedY] = this.deNormalizeCoordinates(x, y);
    return {
      position: 'absolute',
      left: pixelatedX,
      top: pixelatedY,
    }
  }

  handleDrag(energyId, event, ui) {
    const {node, position: {clientX, clientY}} = ui;
    const offsetX = node.getBoundingClientRect().width / 2;
    const offsetY = node.getBoundingClientRect().height / 2;

    const field = node.offsetParent;

    var newX = clientX - field.offsetLeft;
    var newY = clientY - field.offsetTop;

    if (newX <= offsetX) {
      newX = offsetX;
    }
    if (newY <= offsetY) {
      newY = offsetY;
    }
    if (newX >= field.parentElement.offsetWidth - offsetX) {
      newX = field.width;
    }
    if (newY >= field.parentElement.offsetHeight - offsetY) {
      newY = field.height;
    }

    const [normalizedX, normalizedY] = this.normalizeCoordinates(newX,newY);

    this.props.onEnergyMove(energyId, normalizedX, normalizedY);
  }

  handleDoubleClick(event) {
    event.preventDefault();
    const stage = event.currentTarget;
    var pXstage = event.pageX - stage.offsetLeft;
    var pYstage = event.pageY - stage.offsetTop;

    var [normalizedX, normalizedY] = this.normalizeCoordinates(pXstage, pYstage);

    this.props.onEnergyAdd({id: uuid.v1(), x: normalizedX, y: normalizedY, strength: 1, isMuted: false});
  }

  handleEnergyEdit(id, event) {
    this.props.onEnergyEdit(id);
    if (id !== this.props.editingEnergyId) {
      event.stopPropagation();
    }
  }

  handleClick(event) {
    const {target} = event;
    const classList = Array.from(target.classList);
    if (
      classList.indexOf(sliderStyles.handle) === -1 &&
      classList.indexOf(energyStyles.sliderAdditionIcon) === -1
    ) {
      this.props.onEnergyEdit(null);
    }
  }

  render() {

    const rendererProps = Object.assign(this.getProperties(), {
      normalizeCoordinates: this.normalizeCoordinates.bind(this),
      energies: this.props.energies.filter((energy) => !energy.isMuted).map((energy) => ({
        x: energy.x, y: energy.y, strength: energy.strength,
      })),
    })

    let className = 'ForceFieldStage';
    if (this.props.isEnergyMoving) {
      className += ' is-Dragging';
    }

    return (
      <div
        style={{height: '100%'}}
        className={className}
        onClick={this.handleClick.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)} >
        <div style={{position: 'relative', height: '100%'}}>
          {this.props.energies.map((energy) =>
            <DraggableCore key={energy.id}
              onStart={this.props.onEnergyStartMove}
              onDrag={this.handleDrag.bind(this, energy.id)}
              onStop={this.props.onEnergyStopMove} >
              <div style={this.energyPositioningStyles(energy.x, energy.y)} >
                <Energy
                  isPresentationModeEnabled={this.props.isPresentationModeEnabled}
                  isMuted={energy.isMuted}
                  strength={energy.strength}
                  isEditing={this.props.editingEnergyId === energy.id}
                  onEdit={this.handleEnergyEdit.bind(this, energy.id)}
                  onMute={this.props.onEnergyMute.bind({}, energy.id)}
                  onUnmute={this.props.onEnergyUnmute.bind({}, energy.id)}
                  onStrengthChange={this.props.onEnergyStrengthChange.bind({}, energy.id)}
                  onDelete={this.props.onEnergyDelete.bind({}, energy.id)}
                  normalizeCoordinates={this.normalizeCoordinates.bind(this)}
                  deNormalizeCoordinates={this.deNormalizeCoordinates.bind(this)}
                />
              </div>
            </DraggableCore>
          )}
        </div>
        <Renderer {...rendererProps} />
      </div>
    );
  }
}

Stage.propTypes = {
  energies: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    strength: PropTypes.number.isRequired,
    isMuted: PropTypes.bool.isRequired,
  })),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isPresentationModeEnabled: PropTypes.bool,
  isEnergyMoving: PropTypes.bool,
  editingEnergyId: PropTypes.string,
  onEnergyAdd: PropTypes.func,
  onEnergyEdit: PropTypes.func,
  onEnergyMute: PropTypes.func,
  onEnergyUnmute: PropTypes.func,
  onEnergyStartMove: PropTypes.func,
  onEnergyStopMove: PropTypes.func,
  onEnergyMove: PropTypes.func,
  onEnergyStrengthChange: PropTypes.func,
  onEnergyDelete: PropTypes.func,
};

Stage.defaultProps = {
  energies: [],
  isPresentationModeEnabled: false,
  isEnergyMoving: false,
  editingEnergyId: null,
  onEnergyAdd(energy){},
  onEnergyEdit(energyId){},
  onEnergyMute(energyId){},
  onEnergyUnmute(energyId){},
  onEnergyStartMove(){},
  onEnergyStopMove(){},
  onEnergyMove(energyId, x, y){},
  onEnergyStrengthChange(energyId, strength){},
  onEnergyDelete(energyId){},
};
