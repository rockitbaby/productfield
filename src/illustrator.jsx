import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import {createStore} from 'redux';
import {fromJS} from 'immutable';
import reducer from './state/reducer';
import {setState} from './state/action_creators';

import { ForceFieldAnatomy } from 'ProductField';
import { Renderer, defaultVisibility as rendererVisibility } from 'ProductField/Components';

const store = createStore(reducer);
const initialState = fromJS({
  energies: [
    {id: 2, x: 0.4, y: 0.1, strength: 2, isMuted: false},
    {id: 1, x: 0.8, y: -0.8, strength: 1, isMuted: false},
  ],
});
store.dispatch(setState(initialState));

/*

this code is used to generate static svg images.
svg may contain a style element.

the default style loader will append css to
window.document.

when creating static markup we lack a window object.

why do we need gloabl styles at all?
- to speed up svg rendering
- allow transitions on svg elements
- easiliy highlight certain areas of the product field

--

please see inline comments 1) and 2)

*/

// 1) we are importing additional styles as text
import styles from 'raw!./styles/illustrator.css.txt';

const DOTS_IN_FIELD = ForceFieldAnatomy.DOTS_IN_GRID;


function getProperties(params) {

  // @todo url params
  let width = parseInt(params.width, 10) || 800;
  let height = parseInt(params.height, 10) || 800;

  let padding = parseFloat(params.padding) || 0;

  let gridUnitBase = parseInt(params.gridUnitBase, 10) || false;

  let describe = params.describe || false;

  let highlights = params.highlights || '';
  highlights = highlights.split(',');

  let labels = params.labels || '';
  labels = labels.split(',');

  let lines = params.lines || '';
  lines = lines.split(',');

  if(params.describe) {
    let allLabels = ForceFieldAnatomy.LABELS.context.concat(ForceFieldAnatomy.LABELS.core);
    labels = allLabels.slice(0, describe);
    highlights = allLabels.slice(describe - 1, describe);
  }

  let visibility = params.visibility || rendererVisibility;

  if(!Array.isArray(visibility)) {
    visibility = visibility.split(',');
  }

  let dots = params.dots || '';
  dots = dots.split(',');


  let gridUnit = 0;
  let fieldSize = 0;

  if(gridUnitBase) {
    gridUnit = gridUnitBase
    width = gridUnitBase * DOTS_IN_FIELD + padding * 2
    height = gridUnitBase * DOTS_IN_FIELD + padding * 2
    fieldSize = gridUnit * DOTS_IN_FIELD
  } else {
    let horizontalPadding = padding || 0
    let verticalPadding = padding || 0
    let availableWidth = width - horizontalPadding * 2
    let availableHeight = height - verticalPadding * 2
    const maximumFieldSize = Math.floor(Math.min(availableWidth, availableHeight))
    gridUnit = Math.floor(maximumFieldSize / DOTS_IN_FIELD)
    fieldSize = gridUnit * DOTS_IN_FIELD
  }

  return {
    width: width,
    height: height,
    scaleFactor: gridUnit,
    gridUnit: gridUnit,
    skin: {
      dots:   "#000000",
      marker: "#000000",
      arrows: "#000000",
      background: '#FFFFFF',
      areaFill: 'pattern',
      areas: '#FFFF00',
      arrows: '#000000'
    },
    visibility: visibility,
    highlights: highlights,
    labels: labels,
    dots: dots,
    lines: lines,
    fieldSize: fieldSize,
    normalizeCoordinates: function(x, y) {

      let translatedX = (x - width / 2);
      let translatedY = (y - height / 2);

      let normalizedX = (2 * translatedX) / fieldSize;
      let normalizedY = -(2 * translatedY) / fieldSize;

      return [normalizedX, normalizedY];
    }
  };
}


if(typeof document !== "undefined") {

  var pairs = location.search.slice(1).split('&');

  var params = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    params[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  let props = getProperties(params);

  // 2) and inject them inside a style element
  ReactDOM.render(
    <div>
      <style>{styles}</style>
      <Renderer {...props} />
    </div>,
    document.getElementById('app')
  );
}

export default function render(params) {

  let props = getProperties(params);

  // 2) and inject them inside a style element
  return ReactDOMServer.renderToString(
    <svg width={props.width} height={props.height} viewBox={"0 0 " + props.width + " " + props.height}>
      <style>{styles}</style>
      <Renderer {...props} />
    </svg>
    );
}
