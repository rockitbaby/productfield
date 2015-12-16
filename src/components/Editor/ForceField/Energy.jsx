import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyles from '../../../styles/GlobalStyles'
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Map} from 'immutable';
import Slider from './Energy/Slider';


export default React.createClass({
  mixins: [PureRenderMixin],

  energyDragged: function(event) {
    event.preventDefault();
    const energy = event.currentTarget;
    const field = energy.offsetParent;

    var newX = event.pageX - field.offsetLeft;
    var newY = event.pageY - field.offsetTop;

    var [normalizedX, normalizedY] = this.props.normalizeCoordinates(newX,newY);

    this.props.moveEnergy({id: this.props.id, x: normalizedX, y: normalizedY})
  },

  energyClicked: function(event) {
    var currentEnergy = Map({
      id:       this.props.id,
      x:        this.props.x,
      y:        this.props.y,
      strength: this.props.strength
    });

    this.props.editing ? this.props.editEnergy(null) : this.props.editEnergy(currentEnergy);
  },

  render: function() {
    var pos = this.getPos();

    return <div className="Energy"
                draggable='true'
                onDrag={this.energyDragged}
                onClick={this.energyClicked}
                style={pos}>
             <div className="Energy-circle" style={this.getCircleStyle()}>
                <span>{this.props.strength}</span>
             </div>
             { this.props.editing ?
               <div className="Energy-pane sliderWrapper" style={this.getPaneStyle()}>
                 <Slider value={this.props.strength}
                         setStrength={(value) => this.props.setStrength(value)} />
                       <div className="sliderAddition">
                         <img src="/img/delete.svg" onClick={ () => this.props.deleteEnergy()}/>
                      </div>
               </div>
               : null
             }
           </div>;
  },

  circleSize: 30,
  circleSizeWhenEditing: 36,

  getCircleStyle: function() {
    var backgroundColor = function(strength) {
      if (strength > 0) {
        return GlobalStyles.lightGreen;
      } else if (strength < 0) {
        return GlobalStyles.lightRed;
      } else {
        return GlobalStyles.neutralGrey;
      }
    }

    var circleStyles = {
      backgroundColor:  backgroundColor(this.props.strength),
      width: this.circleSize,
      height: this.circleSize,
      boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 1px 0px rgba(0,0,0,0.12)',
      borderRadius: this.circleSize / 2,
      position: 'absolute'
    }

    if(this.props.editing) {
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
    if(this.props.editing) {
      return {
        position: 'absolute',
        left: 1.5 * this.circleSize,
        height: this.paneHeight
      }
    }
    return {};
  },

  getPos: function() {
    var [pixelatedX, pixelatedY] = this.props.deNormalizeCoordinates(this.props.x, this.props.y);

    var originX = -this.circleSize / 2;
    var originY = -this.circleSize / 2;

    if (this.props.editing) {
      originX = -this.circleSizeWhenEditing / 2;
      originY = -this.paneHeight / 2
    }

    var elementPositionX = pixelatedX + originX;
    var elementPositionY = pixelatedY + originY;

    return {
      position: 'absolute',
      transform: 'translate(' + elementPositionX + 'px, ' + elementPositionY + 'px)',
      left: pixelatedX,
      top: pixelatedY
    }
  },
});
