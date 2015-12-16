import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Energy from './Energy';
import Renderer from './Renderer';
import * as actionCreators from '../../../action_creators'
import '../../../styles/main.css';


export const Stage = React.createClass({
  mixins: [PureRenderMixin],

  getProperties: function() {
    const dotsInField = 20;
    const maximumFieldSize = Math.floor(Math.min(this.props.width, this.props.height));
    const gridUnit = Math.floor(maximumFieldSize / dotsInField);
    const fieldSize = gridUnit * dotsInField

    return {
      fieldSize: fieldSize,
      scale: fieldSize / this.props.width,
      gridUnit: gridUnit,
      triangleSize: 2.5,
      minLengthForArrowsToDisplay: 2,
      width:  this.props.width,
      height: this.props.height,
      skin: {
        dots: "#304FFE",
        marker: "#304FFE",
        arrows: "#F2F2F2",
        background: '#FFFFFF'
      }
    }
  },

  deNormalizeOneCoordinate: function (val, isY) {
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

  deNormalizeCoordinates: function(x, y) {

    return [this.deNormalizeOneCoordinate(x, false), this.deNormalizeOneCoordinate(y, true)];
  },

  normalizeCoordinates: function(x, y) {
    var properties = this.getProperties();

    var translatedX = (x - properties.width / 2);
    var translatedY = (y - properties.height / 2);

    var normalizedX = (2 * translatedX) / properties.fieldSize;
    var normalizedY = -(2 * translatedY) / properties.fieldSize;

    return [normalizedX, normalizedY];
  },

  getEnergies: function() {
    return this.props.energies || [];
  },

  addEnergy: function(event) {
    event.preventDefault();
    const stage = event.currentTarget;
    var pXstage = event.pageX - stage.offsetLeft;
    var pYstage = event.pageY - stage.offsetTop;

    var [normalizedX, normalizedY] = this.normalizeCoordinates(pXstage, pYstage);

    this.props.addEnergy({x: normalizedX, y: normalizedY, strength: 1});
  },

  // mouseDebugger: function(event) {
  //   event.preventDefault();
  //   const stage = event.currentTarget;
  //
  //   var pxX = event.pageX - stage.offsetLeft;
  //   var pxY = event.pageY - stage.offsetTop;
  //
  //   console.log(this.normalizeCoordinates(pxX, pxY));
  //
  // },
  //
  render: function() {
    var forceFieldStyle = this.getForceFieldStyle();

    var rendererProps = Object.assign(this.getProperties(), {
      normalizeCoordinates: this.normalizeCoordinates,
      deNormalizeCoordinates: this.deNormalizeCoordinates,
      isPresentation: this.props.isPresentation
    })

    return <div className="ForceFieldStage" onDoubleClick={this.addEnergy} style={{position: 'relative'}}>
      {this.getEnergies().map(energy =>
        <Energy key={energy.get('id')}
               id={energy.get('id')}
               x={energy.get('x')}
               y={energy.get('y')}
               editingEnergy={this.props.editingEnergy}
               deleteEnergy={this.props.deleteEnergy}
               editing={this.props.editingEnergy ? this.props.editingEnergy.get('id') == energy.get('id') : false}
               strength={energy.get('strength')}
               setStrength={this.props.setStrength}
               editEnergy={this.props.editEnergy}
               moveEnergy={this.props.moveEnergy}
               normalizeCoordinates={this.normalizeCoordinates}
               deNormalizeCoordinates={this.deNormalizeCoordinates}
               />
      )}
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
    energies: state.get('energies'),
    editingEnergy: state.get('editingEnergy'),
    isPresentation: state.get('isPresentation')
  };
}

export const ConnectedStage = connect(mapStateToProps, actionCreators)(Stage);
