import React from 'react';
import GlobalStyles from '../../styles/GlobalStyles'
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import {Map} from 'immutable';

export default Radium(React.createClass({
  mixins: [PureRenderMixin],

  pointDragged: function(event) {
    event.preventDefault();
    const point = event.currentTarget;
    const field = point.offsetParent;

    var newX = ((event.pageX - field.offsetLeft - 12.5) * 100) / field.offsetWidth;
    var newY = ((event.pageY - field.offsetTop - 12.5) * 100) / field.offsetHeight;

    this.props.movePoint({id: this.props.id, x: newX, y: newY})
  },

  render: function() {
    var pointStyle = this.getPointStyle();
    var fontStyle = this.getFontStyle();

    return <div className="force-field-stage-point"
                style={pointStyle}
                draggable='true'
                onClick={ () => this.props.editPoint(Map(this.props)) }
                onDragEnd={ (e) => this.pointDragged(e) }
                onDrag={ (e) => this.pointDragged(e) }><span style={fontStyle}>{this.props.strength}</span></div>;
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
      verticalAlign: 'middle',
      textAlign: 'center',
      position: 'absolute',
      width: '25',
      paddingTop: '2',
      height: '23',
      boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.24), 0px 1px 4px 0px rgba(0,0,0,0.12)',
      border: '3px solid white',
      borderRadius: '20',
      left: this.props.x + '%',
      top: this.props.y + '%',
    }
  },

  getFontStyle: function() {
    return {
      fontSize: '0.8em',
      color: GlobalStyles.fontColor,
      opacity: '0.5',
    }
  }
}));
