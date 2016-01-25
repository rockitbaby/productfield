import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {fromJS, Map} from 'immutable';
import {DraggableCore} from 'react-draggable';
import GlobalStyles from '../../../styles/GlobalStyles'
import Slider from './Energy/Slider';

const CIRCLE_SIZE = 30;
const EDITING_CIRCLE_SIZE = 36;
const PANE_HEIGHT = 265;

export class Energy extends Component {

  getCircleStyle() {
    var backgroundColor = function(strength, isMuted) {
      if (isMuted) {
        return GlobalStyles.neutralGrey;
      } else {
        if (strength > 0) {
          return GlobalStyles.lightGreen;
        } else if (strength < 0) {
          return GlobalStyles.lightRed;
        } else {
          return GlobalStyles.neutralGrey;
        }
      }
    }

    var circleStyles = {
      display: 'flex',
      'boxSizing': 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:  backgroundColor(this.props.strength, this.props.isMuted),
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 1px 0px rgba(0,0,0,0.12)',
      borderRadius: CIRCLE_SIZE / 2,
      position: 'absolute'
    }

    if (this.isEditing()) {
      Object.assign(circleStyles, {
        width: EDITING_CIRCLE_SIZE,
        height: EDITING_CIRCLE_SIZE,
        borderRadius: EDITING_CIRCLE_SIZE / 2,
        border: '3px solid white',
        top: PANE_HEIGHT / 2 - EDITING_CIRCLE_SIZE / 2
      });
    }

    return circleStyles;
  }

  getPaneStyle() {
    if(this.isEditing()) {
      return {
        position: 'absolute',
        left: 1.5 * CIRCLE_SIZE,
        height: PANE_HEIGHT
      }
    }
  }

  getWrapperStyle() {
    var [pixelatedX, pixelatedY] = this.props.deNormalizeCoordinates(this.props.x, this.props.y);
    var [offsetX, offsetY] = this.componentSizeOffset();

    return {
      position: 'absolute',
      transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px)',
      left: pixelatedX,
      top: pixelatedY,
      userSelect: 'none',
      cursor: 'default',
    }
  }

  energyClicked(event) {
    var currentEnergy = Map({
      id:       this.props.id,
      x:        this.props.x,
      y:        this.props.y,
      strength: this.props.strength,
      isMuted:  this.props.isMuted
    });

    this.isEditing() ? this.props.editEnergy(null) : this.props.editEnergy(currentEnergy);
  }

  toggleMuteEnergy() {
    var currentEnergy = Map({
      id:       this.props.id,
      x:        this.props.x,
      y:        this.props.y,
      strength: this.props.strength,
      isMuted:  this.props.isMuted ? false : true
    });

    this.props.setMute(currentEnergy);
  }

  componentSizeOffset() {
    var translationX = - CIRCLE_SIZE / 2;
    var translationY = - CIRCLE_SIZE / 2;

    if (this.isEditing()) {
      translationX = - EDITING_CIRCLE_SIZE / 2;
      translationY = - PANE_HEIGHT / 2
    }

    return [translationX, translationY];
  }

  isEditing() {
    return this.props.editingEnergy && this.props.editingEnergy.get('id') == this.props.id;
  }

  handleDragStart() {
    event.preventDefault();
    event.stopPropagation();
    this.props.startDragging();
  }

  handleDragStop() {
    event.preventDefault();
    event.stopPropagation();
    this.props.stopDragging();
  }

  handleDrag(event, ui) {
    event.preventDefault();
    event.stopPropagation();
    const {node, position: {clientX, clientY}} = ui;

    const field = node.offsetParent;

    var newX = clientX - field.offsetLeft;
    var newY = clientY - field.offsetTop;

    const [normalizedX, normalizedY] = this.props.normalizeCoordinates(newX,newY);

    this.props.moveEnergy(fromJS({id: this.props.id, x: normalizedX, y: normalizedY, isMuted: this.props.isMuted}))
  }

  renderEnergyEditor() {
    return (
      <div className="Energy-pane" style={this.getPaneStyle()}>
        <Slider value={this.props.strength}
          setStrength={this.props.setStrength}
          isPresentation={this.props.isPresentation}/>
        <div className={this.props.isPresentation ? " sliderAddition sliderAddition-dark" : "sliderAddition sliderAddition-light"}>
          <div className="sliderAdditionIconWrapper">
            {this.props.isMuted ?
            <img src="/img/unmute.svg" onClick={this.toggleMuteEnergy.bind(this)}/>
            :
            <img src="/img/mute.svg" onClick={this.toggleMuteEnergy.bind(this)}/>
            }
          </div>
          <div className="sliderAdditionIconWrapper">
            <img src="/img/delete.svg" onClick={this.props.deleteEnergy.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <DraggableCore
        onStart={this.handleDragStart.bind(this)}
        onDrag={this.handleDrag.bind(this)}
        onStop={this.handleDragStop.bind(this)} >
        <div className="Energy"
          onClick={this.energyClicked.bind(this)}
          style={this.getWrapperStyle()}>
          <div className="Energy-circle" style={this.getCircleStyle()}>
            <span>{this.props.strength}</span>
          </div>
          { this.isEditing() ? this.renderEnergyEditor() : null }
        </div>
      </DraggableCore>
    );
  }

}

Energy.propTypes = {
  id: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  strength: PropTypes.number.isRequired,
  isPresentation: PropTypes.bool,
  isMuted: PropTypes.bool,
  editingEnergy: PropTypes.object,
  startDragging: PropTypes.func,
  stopDragging: PropTypes.func
};

Energy.defaultProps = {
  isPresentation: false,
  isMuted: false,
  startDragging(){},
  stopDragging(){},
};
