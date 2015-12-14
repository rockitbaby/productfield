import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStyles from '../../styles/GlobalStyles'
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import {Map} from 'immutable';
import Slider from './Slider';

export default Radium(React.createClass({
  mixins: [PureRenderMixin],

  pointDragged: function(event) {
    event.preventDefault();
    const point = event.currentTarget;
    const field = point.offsetParent;

    var newX = ((event.pageX - field.offsetLeft) * 100) / field.offsetWidth;
    var newY = ((event.pageY - field.offsetTop) * 100) / field.offsetHeight;
    this.props.movePoint({id: this.props.id, x: newX, y: newY})
  },

  pointDraggedEnded: function(event) {
    event.preventDefault();
    const point = event.currentTarget;
    const field = point.offsetParent;

    var newX = ((event.pageX - field.offsetLeft + 12.5) * 100) / field.offsetWidth;
    var newY = ((event.pageY - field.offsetTop - 124.5) * 100) / field.offsetHeight;
    this.props.movePoint({id: this.props.id, x: newX, y: newY})
  },

  pointClicked: function(event) {

    var currentPoint = Map({
      id:       this.props.id,
      x:        this.props.x,
      y:        this.props.y,
      strength: this.props.strength
    });

    if (this.props.editingPoint && currentPoint.get('id') == this.props.editingPoint.get('id')) {
      this.props.editPoint(null);
    } else {
      this.props.editPoint(currentPoint);
    }
  },

  render: function() {
    var pointStyle = this.getPointStyle();
    var fontStyle = this.getFontStyle();
    var pos = this.getPos();

    return <div className="force-field-stage-point"
                draggable='true'
                onDragEnd={ (e) => this.pointDraggedEnded(e) }
                onDrag={ (e) => this.pointDragged(e) }
                style={pos}>
             <div style={pointStyle}
                onClick={ (e) => this.pointClicked(e) }>
                <span style={fontStyle}>{this.props.strength}</span>
             </div>
             { this.props.editing ?
               <div>
                 <Slider value={this.props.strength}
                         setStrength={(value) => this.props.setStrength(value)}/>
                       <div className="sliderAddition"></div>
               </div>
               : null
             }
           </div>;
  },

  getPointStyle: function() {
    var backgroundColor = function(strength) {
      if (strength > 0) {
        return GlobalStyles.lightGreen;
      } else if (strength < 0) {
        return GlobalStyles.lightRed;
      } else {
        return GlobalStyles.neutralGrey;
      }
    }

    return {
      backgroundColor:  backgroundColor(this.props.strength),
      display: 'table',
      textAlign: 'center',
      width: '36',
      paddingTop: '-20',
      height: '36',
      boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 1px 0px rgba(0,0,0,0.12)',
      border: '3px solid white',
      borderRadius: '25',
    }
  },

  getPos: function() {
    return {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      marginTop: '-100px',
      marginLeft: '-12px',
      height: '200px',
      left: this.props.x + '%',
      top: this.props.y + '%',
    }
  },

  getFontStyle: function() {
    return {
      fontSize: '1.0em',
      color: GlobalStyles.fontColor,
      opacity: '0.5',
    }
  }
}));
