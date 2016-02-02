import React, {Component, PropTypes} from 'react';
import {fromJS, Map} from 'immutable';
import {DraggableCore} from 'react-draggable';
import GlobalStyles from '../../../styles/GlobalStyles'
import {Slider} from './Energy/Slider';

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

    if (this.props.isEditing) {
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
    if (this.props.isEditing) {
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

  componentSizeOffset() {
    var translationX = - CIRCLE_SIZE / 2;
    var translationY = - CIRCLE_SIZE / 2;

    if (this.props.isEditing) {
      translationX = - EDITING_CIRCLE_SIZE / 2;
      translationY = - PANE_HEIGHT / 2
    }

    return [translationX, translationY];
  }

  handleDrag(event, ui) {
    event.preventDefault();
    event.stopPropagation();
    const {node, position: {clientX, clientY}} = ui;

    const field = node.offsetParent;

    var newX = clientX - field.offsetLeft;
    var newY = clientY - field.offsetTop;

    const [normalizedX, normalizedY] = this.props.normalizeCoordinates(newX,newY);

    this.props.onMove(normalizedX, normalizedY);
  }

  renderEnergyEditor() {
    return (
      <div className="Energy-pane" style={this.getPaneStyle()}>
        <Slider value={this.props.strength}
          onChange={this.props.onStrengthChange}
          isPresentation={this.props.isPresentation}/>
        <div className={this.props.isPresentation ? " sliderAddition sliderAddition-dark" : "sliderAddition sliderAddition-light"}>
          <div className="sliderAdditionIconWrapper">
            {this.props.isMuted ?
            <img src="/img/unmute.svg" onClick={this.props.onUnmute}/>
            :
            <img src="/img/mute.svg" onClick={this.props.onMute}/>
            }
          </div>
          <div className="sliderAdditionIconWrapper">
            <img src="/img/delete.svg" onClick={this.props.onDelete}/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <DraggableCore
        onStart={this.props.onStartMove}
        onDrag={this.handleDrag.bind(this)}
        onStop={this.props.onStopMove} >
        <div className="Energy"
          onClick={this.props.onEdit}
          style={this.getWrapperStyle()}>
          <div className="Energy-circle" style={this.getCircleStyle()}>
            <span>{this.props.strength}</span>
          </div>
          { this.props.isEditing ? this.renderEnergyEditor() : null }
        </div>
      </DraggableCore>
    );
  }

}

Energy.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  strength: PropTypes.number.isRequired,
  isPresentation: PropTypes.bool,
  isMuted: PropTypes.bool,
  isEditing: PropTypes.bool,
  deNormalizeCoordinates: PropTypes.func.isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onMute: PropTypes.func,
  onUnmute: PropTypes.func,
  onStartMove: PropTypes.func,
  onStopMove: PropTypes.func,
  onMove: PropTypes.func,
  onStrengthChange: PropTypes.func,
  onDelete: PropTypes.func,
};

Energy.defaultProps = {
  isPresentation: false,
  isMuted: false,
  isEditing: false,
  onEdit(event){},
  onMute(){},
  onUnmute(){},
  onStartMove(){},
  onStopMove(){},
  onMove(x, y){},
  onStrengthChange(strength){},
  onDelete(){},
};
