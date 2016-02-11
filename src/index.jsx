import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose} from 'redux';
import {fromJS} from 'immutable';
import uuid from 'node-uuid';
import {ConnectedEditor} from './state/components/ConnectedEditor';
import reducer, {observeEnergies} from './state/reducer';
import {setState} from './state/action_creators';
import * as actionCreators from './state/action_creators';
import styles from './styles/main.css';

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : (f) => f,
)(createStore);
const store = finalCreateStore(reducer);

const initialState = fromJS({energies: [
  {id: uuid.v1(), x: -1, y: -1, strength: 10, isMuted: false},
  {id: uuid.v1(), x: 1, y: 1, strength: -10, isMuted: false},
  {id: uuid.v1(), x: -1, y: 1, strength: -10, isMuted: false},
  {id: uuid.v1(), x: 1, y: -1, strength: 10, isMuted: false},
]});
store.dispatch(setState(initialState));

ReactDOM.render(
  <ConnectedEditor store={store} />,
  document.getElementById('app')
);
