import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import EditBar from './ForceField/EditBar';
import Point from './ForceField/Point';
import Canvas from './ForceField/Canvas';
import * as actionCreators from '../action_creators'
import '../styles/main.css';


export const ForceField = React.createClass({
  mixins: [PureRenderMixin],

  getProperties: function() {
    const navbarHeight = 50;
    const paddingBottom = 30;
    const dotsInField = 20;
    var availableHeight = $(window).height() - navbarHeight - paddingBottom;
    var gridUnit = Math.min($(window).width(), availableHeight) / dotsInField;
    var fieldSize = gridUnit * dotsInField

    return {
      fieldSize: fieldSize,
      scale: fieldSize / $(window).width(),
      gridUnit: gridUnit,
      triangleSize: 2.5,
      minLengthForArrowsToDisplay: 2,
      width:  $(window).width(),
      height: $(window).height() - navbarHeight,
      skin: {
        dots: "#304FFE",
        marker: "#304FFE",
        arrows: "#F2F2F2",
        background: '#FFFFFF'
      }
    }
  },

  deNormalizeCoordinates: function (val, isY) {
    var properties = this.getProperties();

    var deNormalizedVal = (val * properties.fieldSize) / 2;
    var deTranslatedVal = deNormalizedVal;

    if(isY) {
      deTranslatedVal = deNormalizedVal - properties.height / 2;
      deTranslatedVal = deTranslatedVal * -1;
    } else {
      deTranslatedVal = deTranslatedVal + properties.width / 2;
    }

    return deTranslatedVal;
  },

  normalizeCoordinates: function(x, y) {
    var properties = this.getProperties();

    var translatedX = (x - properties.width / 2);
    var translatedY = (y - properties.height / 2);

    var normalizedX = (2 * translatedX) / properties.fieldSize;
    var normalizedY = -(2 * translatedY) / properties.fieldSize;

    return [normalizedX, normalizedY];
  },

  //needs normalized coordinate value
  pixelToPercentage: function(val, isY) {
    var prop =  this.getProperties();

    var deNormalizedVal = this.deNormalizeCoordinates(val, isY);

    if(isY) {
      var valInPercent = (deNormalizedVal / prop.height) * 100;
    } else {
      var valInPercent = (deNormalizedVal / prop.width) * 100;
    }
    return valInPercent;
  },

  getPoints: function() {
    return this.props.points || [];
  },

  addPoint: function(event) {
    event.preventDefault();
    const point = event.currentTarget;
    const field = point.offsetParent;

    var newX = event.nativeEvent.offsetX;
    var newY = event.nativeEvent.offsetY - point.clientHeight + point.offsetTop;

    var result = this.normalizeCoordinates(newX,newY);

    this.props.addPoint({id: null, x: result[0], y: result[1]})
  },

  render: function() {
    var forceFieldStyle = this.getForceFieldStyle();

    return <div className="force-field">
      <EditBar editingPoint={this.props.editingPoint} addPoint={this.props.addPoint} deletePoint={this.props.deletePoint} setStrength={this.props.setStrength} setPresentation={this.props.setPresentation} isPresentation={this.props.isPresentation}/>
        <div className="force-field-stage" style={forceFieldStyle} onDoubleClick={(e) => this.addPoint(e)} id="field">
          <Canvas points={this.getPoints()}
                  setLastRenderTimestamp={this.props.setLastRenderTimestamp}
                  lastTimestamp={this.props.lastTimestamp}
                  isPresentation={this.props.isPresentation}
                  properties={this.getProperties}
                  normalizeCoordinates={this.normalizeCoordinates}
                  deNormalizeCoordinates={this.deNormalizeCoordinates}/>
          {this.getPoints().map(point =>
            <Point key={point.get('id')}
                   id={point.get('id')}
                   x={this.pixelToPercentage(point.get('x'), false)}
                   y={this.pixelToPercentage(point.get('y'), true)}
                   editingPoint={this.props.editingPoint}
                   deletePoint={this.props.deletePoint}
                   editing={this.props.editingPoint ? this.props.editingPoint.get('id') == point.get('id') : false}
                   strength={point.get('strength')}
                   setStrength={this.props.setStrength}
                   editPoint={this.props.editPoint}
                   normalizeCoordinates={this.normalizeCoordinates}
                   deNormalizeCoordinates={this.deNormalizeCoordinates}
                   pixelToPercentage={this.pixelToPercentage}
                   movePoint={this.props.movePoint}/>
          )}
      </div>
    </div>;
  },

  getForceFieldStyle: function() {
    return {
      fontFamily: 'Roboto, sans-serif',
      position: 'relative',
      margin: '0 auto',
      width: '100%',
      height: '100%',
      transition: 'width 0.2s, height 0.2s',
    }
  }
});

function mapStateToProps(state) {
  return {
    points: state.get('points'),
    editingPoint: state.get('editingPoint'),
    lastTimestamp: state.get('lastTimestamp'),
    isPresentation: state.get('isPresentation')
  };
}

export const ForceFieldContainer = connect(mapStateToProps, actionCreators)(ForceField);
