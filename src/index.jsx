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
var initialState = fromJS({points: [{id: 2, x: 0, y: 0, strength: 1}, {id: 1, x: 0, y: 0, strength: 1}]});
store.dispatch(setState(initialState));

ReactDOM.render(
  <Provider store={store}>
    <ForceFieldContainer pointDragged={pointDragged} pointClicked={pointClicked} />
  </Provider>,
  document.getElementById('app')
);
