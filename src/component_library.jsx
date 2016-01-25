import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ForceArrow, Forces} from './components/Editor/ForceField/Renderer/Forces';

class SvgComponent extends Component {
  render() {
    return (
      <svg style={this.props.style}>
        {this.props.children}
      </svg>
    );
  }
}

function normalizeCoordinates(x,y) {
  return [x,y];
}

// const dotsInField = 20;
// const maximumFieldSize = Math.floor(Math.min(this.props.width, this.props.height)) - 50;
// const gridUnit = Math.floor(maximumFieldSize / dotsInField);
// const fieldSize = gridUnit * dotsInField


ReactDOM.render(
  <div>
    <h2>Forces</h2>
    <SvgComponent style={{}}>
      <Forces
        stageWidth={300}
        stageHeight={300}
        fieldSize={250}
        gridUnit={250 / 10}
        skin={{arrows: '#ff0000'}}
        normalizeCoordinates={normalizeCoordinates}
      />
    </SvgComponent>
    <h2>ForceArrow</h2>
    <SvgComponent style={{width: '100px', height: '100px'}}>
      <ForceArrow
        x={50}
        y={50}
        x2={60}
        y2={60}
        deg={90}
        triangleSize={4}
        skin={{arrows: '#ff0000'}}
        normalizeCoordinates={normalizeCoordinates}
      />
    </SvgComponent>
  </div>,
  document.getElementById('component-library')
);
