import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {ConnectedEnergy} from './Energy';
import Renderer from './Renderer';
import * as actionCreators from '../../../action_creators'
import '../../../styles/main.css';


export const Stage = React.createClass({
  mixins: [PureRenderMixin],

  getProperties: function() {
    const dotsInField = 10;
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

    var className = 'ForceFieldStage';
    if(this.props.dragging) {
      className += ' is-Dragging';
    }

    return <div className={className} onDoubleClick={this.addEnergy} style={{position: 'relative'}}>
      <Renderer {...rendererProps} />
      {this.getEnergies().map(energy =>
        <ConnectedEnergy key={energy.get('id')}
                         id={energy.get('id')}
                         stageWidth={this.props.width}
                         stageHeight={this.props.height}
                         normalizeCoordinates={this.normalizeCoordinates}
                         deNormalizeCoordinates={this.deNormalizeCoordinates} />
      )}
    </div>;
  },

  getForceFieldStyle: function() {
    return {
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
    isPresentation: state.get('isPresentation'),
    dragging: state.get('dragging')
  };
}

export const ConnectedStage = connect(mapStateToProps, actionCreators)(Stage);
