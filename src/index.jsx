import jquery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {ForceFieldContainer} from './components/ForceField';
import {ForceFieldCanvas} from './ForceFieldCanvas';
import reducer from './reducer';
import {setState} from './action_creators'


const pointDragged = (id, ) => { console.log(`Dragged point ${id}`) };
const pointClicked = (id) => { alert(`CLICKED POINT ${id}`) }

const store = createStore(reducer);
var initialState = fromJS({points: [{id: 2, x: 2, y: 95, strength: 5}, {id: 1, x: 20, y: 50, strength: 5}]});
store.dispatch(setState(initialState));

ReactDOM.render(
  <Provider store={store}>
    <ForceFieldContainer pointDragged={pointDragged} pointClicked={pointClicked} />
  </Provider>,
  document.getElementById('app')
);

window.setup = function() {
  ForceFieldCanvas.init();
  canvas = createCanvas();
  var $canvas = $(canvas.elt);
  $canvas.css({
    display: 'block'
  });
  $canvas.class = 'force-field-stage-canvas'
  $canvas.data({
    gridUnit: ForceFieldCanvas.options.gridUnit,
    gridScale: ForceFieldCanvas.options.scale,
    gridDotSize: ForceFieldCanvas.options.gridDotSize
  });

  $('.force-field-stage').append($canvas);
  frameRate(30);
  resizeCanvas(ForceFieldCanvas.options.width, ForceFieldCanvas.options.height);
};

window.draw = function() {
  background('#FFFFFF');
  ForceFieldCanvas.drawGridChrome();

  for(var x = -1; x < 1; x = x + 0.1) {
    for(var y = -1; y < 1; y = y + 0.1) {
      ForceFieldCanvas.drawForce({x: x, y: y});
    }
  }
};
