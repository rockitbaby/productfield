import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {Editor} from './components/Editor/Editor';
import reducer from './state/reducer';
import {setState} from './state/action_creators'
import * as actionCreators from './state/action_creators'

const store = createStore(reducer);
var initialState = fromJS({energies: [{id: 2, x: 0.4, y: 0.1, strength: 1, isMuted: false}, {id: 1, x: 0, y: 0, strength: 1, isMuted: true}]});
store.dispatch(setState(initialState));

ReactDOM.render(
  <Provider store={store}>
    <Editor />
  </Provider>,
  document.getElementById('app')
);
