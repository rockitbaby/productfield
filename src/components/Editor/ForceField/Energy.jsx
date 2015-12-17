import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyles from '../../../styles/GlobalStyles'
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS, Map} from 'immutable';
import * as actionCreators from '../../../action_creators'
import Slider from './Energy/Slider';


export const Energy = React.createClass({
  mixins: [PureRenderMixin],

  energyDragEnded: function(event) {
    event.preventDefault();

    const energy = event.currentTarget;
    const stage = energy.offsetParent;
    var [offsetX, offsetY] = this.componentSizeOffset();

    var pXstage = event.clientX - stage.offsetLeft - offsetX;
    var pYstage = event.clientY - stage.offsetTop + offsetY;

    var [normalizedX, normalizedY] = this.props.normalizeCoordinates(pXstage, pYstage);

    this.props.moveEnergy(fromJS({id: this.props.id, x: normalizedX, y: normalizedY}));
    this.props.stopDragging();
  },

  energyDragged: function(event) {
    event.preventDefault();

    const energy = event.currentTarget;
    const field = energy.offsetParent;

    var newX = event.clientX - field.offsetLeft;
    var newY = event.clientY - field.offsetTop;

    var [normalizedX, normalizedY] = this.props.normalizeCoordinates(newX,newY);

    this.props.startDragging();
    this.props.moveEnergy(fromJS({id: this.props.id, x: normalizedX, y: normalizedY}))
  },

  energyClicked: function(event) {
    var currentEnergy = Map({
      id:       this.props.id,
      x:        this.props.x,
      y:        this.props.y,
      strength: this.props.strength
    });

    this.isEditing() ? this.props.editEnergy(null) : this.props.editEnergy(currentEnergy);
  },

  componentSizeOffset: function() {
    var translationX = - this.circleSize / 2;
    var translationY = - this.circleSize / 2;

    if (this.isEditing()) {
      translationX = - this.circleSizeWhenEditing / 2;
      translationY = - this.paneHeight / 2
    }

    return [translationX, translationY];
  },

  isEditing: function() {
    return this.props.editingEnergy && this.props.editingEnergy.get('id') == this.props.id;
  },

  render: function() {
    return <div className="Energy"
                draggable='true'
                onDrag={this.energyDragged}
                onClick={this.energyClicked}
                onDragEnd={this.energyDragEnded}
                style={this.getWrapperStyle()}>
             <div className="Energy-circle" style={this.getCircleStyle()}>
                <span>{this.props.strength}</span>
             </div>
             { this.isEditing() ?
               <div className="Energy-pane" style={this.getPaneStyle()}>
                 <Slider value={this.props.strength}
                         setStrength={this.props.setStrength} />
                       <div className="sliderAddition">
                         <img src="/img/delete.svg" onClick={this.props.deleteEnergy}/>
                      </div>
               </div>
               : null
             }
           </div>;
  },

  circleSize: 30,
  circleSizeWhenEditing: 36,

  getCircleStyle: function() {
    var backgroundColor = function(strength, isMuted) {
      if(isMuted) {
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
      width: this.circleSize,
      height: this.circleSize,
      boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 1px 0px rgba(0,0,0,0.12)',
      borderRadius: this.circleSize / 2,
      position: 'absolute'
    }

    if(this.isEditing()) {
      Object.assign(circleStyles, {
        width: this.circleSizeWhenEditing,
        height: this.circleSizeWhenEditing,
        borderRadius: this.circleSizeWhenEditing / 2,
        border: '3px solid white',
        top: this.paneHeight / 2 - this.circleSizeWhenEditing / 2
      });
    }

    return circleStyles;
  },

  paneHeight: 265,

  getPaneStyle: function() {
    if(this.isEditing()) {
      return {
        position: 'absolute',
        left: 1.5 * this.circleSize,
        height: this.paneHeight
      }
    }
  },

  getWrapperStyle: function() {
    var [pixelatedX, pixelatedY] = this.props.deNormalizeCoordinates(this.props.x, this.props.y);
    var [offsetX, offsetY] = this.componentSizeOffset();

    return {
      position: 'absolute',
      transform: 'translate(' + offsetX + 'px, ' + offsetY + 'px)',
      left: pixelatedX,
      top: pixelatedY
    }
  },
});

function mapStateToProps(state, ownProps) {
  var energy = state.get('energies').find(function(energy) {
    return this.id == energy.get('id');
  }, ownProps);

  return {
    id: energy.get('id'),
    x: energy.get('x'),
    y: energy.get('y'),
    strength: energy.get('strength'),
    editingEnergy: state.get('editingEnergy'),
    startDragging: state.get('startDragging'),
    stopDragging: state.get('stopDragging'),
    isMuted: energy.get('isMuted')
  };
}

export const ConnectedEnergy = connect(mapStateToProps, actionCreators)(Energy);
