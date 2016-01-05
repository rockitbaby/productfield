import React from 'react';
import Renderer from './components/Editor/ForceField/Renderer';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

const DOTS_IN_FIELD = 20;

// @todo url params
let width = 800;
let height = 400;

const maximumFieldSize = Math.floor(Math.min(width, height));
const gridUnit = Math.floor(maximumFieldSize / DOTS_IN_FIELD);
const fieldSize = gridUnit * DOTS_IN_FIELD

var props = {
  width: width,
  height: height,
  gridUnit: gridUnit,
  skin: {
    dots:   "#304FFE",
    marker: "#304FFE",
    arrows: "#F2F2F2",
    background: '#FFFFFF',
    triangleSize: 2.5,
    minLengthForArrowsToDisplay: 2
  },
  visibility: {
    forces: false,
    grid: true,
    marker: true
  },
  fieldSize: fieldSize,
  normalizeCoordinates: function(x, y) {

    let translatedX = (x - width / 2);
    let translatedY = (y - height / 2);

    let normalizedX = (2 * translatedX) / fieldSize;
    let normalizedY = -(2 * translatedY) / fieldSize;

    return [normalizedX, normalizedY];
  }
};

if(typeof document !== "undefined") {
  
  ReactDOM.render(
    <Renderer {...props} />,
    document.getElementById('app')
  );
}

export default function renderToString() {
  return ReactDOMServer.renderToString(<Renderer {...props} />);
}