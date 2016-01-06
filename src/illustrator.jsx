import React from 'react';
import Renderer from './components/Editor/Stage/Renderer';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

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

const DOTS_IN_FIELD = 20;


function getProperties(params) {

  console.log(params);
  // @todo url params
  let width = params.width || 800;
  let height = params.height || 800;
  let highlights = params.highlights || '';
  highlights = highlights.split(',');

  const maximumFieldSize = Math.floor(Math.min(width, height));
  const gridUnit = Math.floor(maximumFieldSize / DOTS_IN_FIELD);
  const fieldSize = gridUnit * DOTS_IN_FIELD

  return {
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
    highlights: highlights,
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
    <svg>
      <style>{styles}</style>
      <Renderer {...props} />
    </svg>
    );
}
