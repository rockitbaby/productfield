import React, {Component, PropTypes} from 'react';
import {DraggableCore} from 'react-draggable';
import uuid from 'node-uuid';
import {Energy} from './Stage/Energy';
import {EnergyEditor} from './Stage/EnergyEditor';
import {Renderer} from 'ProductField';

const FORCE_ARROW_HEAD_SIZE = 4;
const MIN_FORCE_ARROW_LENGTH = 2;
const DOTS_IN_FIELD = 20;
const FIELD_PADDING = 50;
const GRID_UNIT = 0.1;

export class Stage extends Component {

  getProperties() {
    const maximumFieldSize = Math.floor(Math.min(this.props.width, this.props.height)) - FIELD_PADDING;
    const scaleFactor = Math.floor(maximumFieldSize / DOTS_IN_FIELD);
    const fieldSize = scaleFactor * DOTS_IN_FIELD;

    const lightSkin = {
                     dots:   "#304FFE",
                     marker: "#304FFE",
                     lines: "#000000",
                     positiveArrow: "#008000",
                     negativeArrow: "#800000",
                     background: '#FFFFFF',
                   };
    const darkSkin = {
                     dots:   "#FFFFFF",
                     marker: "#FFFFFF",
                     lines: "#F2F2F2",
                     positiveArrow: "#008000",
                     negativeArrow: "#800000",
                     background: '#000000',
                   };

    return {
      fieldSize: fieldSize,
      gridUnit: GRID_UNIT,
      scaleFactor: scaleFactor,
      triangleSize: FORCE_ARROW_HEAD_SIZE,
      minLengthForArrowsToDisplay: MIN_FORCE_ARROW_LENGTH,
      width:  this.props.width,
      height: this.props.height,
      skin: this.props.isPresentationModeEnabled ? darkSkin : lightSkin,
    };
  }

  deNormalizeOneCoordinate(val, isY) {
    const properties = this.getProperties();

    const deNormalizedVal = (val * properties.fieldSize) / 2;
    let deTranslatedVal = deNormalizedVal;

    if(isY) {
      deTranslatedVal = deNormalizedVal - properties.height / 2;
      deTranslatedVal = deTranslatedVal * -1;
    } else {
      deTranslatedVal = deTranslatedVal + properties.width / 2;
    }

    return deTranslatedVal;
  }

  deNormalizeCoordinates(x, y) {
    return [this.deNormalizeOneCoordinate(x, false), this.deNormalizeOneCoordinate(y, true)];
  }

  normalizeCoordinates(x, y) {
    const properties = this.getProperties();

    const translatedX = (x - properties.width / 2);
    const translatedY = (y - properties.height / 2);

    const normalizedX = (2 * translatedX) / properties.fieldSize;
    const normalizedY = -(2 * translatedY) / properties.fieldSize;

    return [normalizedX, normalizedY];
  }

  energyPositioningStyles(x, y) {
    const [pixelatedX, pixelatedY] = this.deNormalizeCoordinates(x, y);
    return {
      position: 'absolute',
      left: pixelatedX,
      top: pixelatedY,
    };
  }

  energyEditorPositioningStyles(x, y) {
    const [pixelatedX, pixelatedY] = this.deNormalizeCoordinates(x, y);
    let leftOffset = 0;
    let topOffset = 0;
    // TODO: Get rid of these hard coded pixel values
    if (pixelatedX + 72 >= this.props.width) {
      leftOffset = -80;
    }
    if (pixelatedY + 230/2+50 >= this.props.height) {
      topOffset = -230/2-36;
    }
    if (pixelatedY - 60 <= 0) {
      topOffset = 60;
    }
    return {
      position: 'relative',
      top: topOffset,
      left: leftOffset,
    };
  }

  handleDrag(energyId, event, ui) {
    const {node, position: {clientX, clientY}} = ui;
    const offsetX = node.getBoundingClientRect().width / 2;
    const offsetY = node.getBoundingClientRect().height / 2;

    const field = node.offsetParent;

    let newX = clientX - field.offsetLeft;
    let newY = clientY - field.offsetTop;

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
    const pXstage = event.pageX - stage.offsetLeft;
    const pYstage = event.pageY - stage.offsetTop;

    const [normalizedX, normalizedY] = this.normalizeCoordinates(pXstage, pYstage);

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
    this.props.onEnergyEdit(null);
  }

  render() {

    const rendererProps = Object.assign(this.getProperties(), {
      energies: this.props.energies.filter((energy) => !energy.isMuted).map((energy) => ({
        x: energy.x, y: energy.y, strength: energy.strength,
      })),
      isPresentationModeEnabled: this.props.isPresentationModeEnabled,
    });

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
                  isMuted={energy.isMuted}
                  strength={energy.strength}
                  isEditing={this.props.editingEnergyId === energy.id}
                  onEdit={this.handleEnergyEdit.bind(this, energy.id)}
                />
                {this.props.editingEnergyId === energy.id ?
                  <div style={this.energyEditorPositioningStyles(energy.x, energy.y)}>
                    <EnergyEditor
                      isPresentationModeEnabled={this.props.isPresentationModeEnabled}
                      isMuted={energy.isMuted}
                      strength={energy.strength}
                      energyId={energy.id}
                      onMute={this.props.onEnergyMute.bind({}, energy.id)}
                      onUnmute={this.props.onEnergyUnmute.bind({}, energy.id)}
                      onStrengthChange={this.props.onEnergyStrengthChange.bind({}, energy.id)}
                      onDelete={this.props.onEnergyDelete.bind({}, energy.id)}
                    />
                  </div> : ''
                }
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
