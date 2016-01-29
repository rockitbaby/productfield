import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {Editor} from './components/Editor/Editor';
import reducer, {observeEnergies} from './state/reducer';
import {setState} from './state/action_creators'
import * as actionCreators from './state/action_creators'
import {ForceFieldCalculationSingleton, coordinateSystemTransformation} from './ForceFieldCalculation'

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = finalCreateStore(reducer);

const unsubscribeEnergiesObserver = observeEnergies(store, (energies) => {
  ForceFieldCalculationSingleton.getInstance().setEnergies(coordinateSystemTransformation(energies.toJS()));
});

var initialState = fromJS({energies: [
  {id: 1, x: 0, y: 0, strength: 1, isMuted: true},
  {id: 2, x: 0.4, y: 0.1, strength: 1, isMuted: false},
  {id: 3, x: -0.2, y: -0.4, strength: 1, isMuted: false},
  {id: 4, x: 0.2, y: -0.2, strength: 1, isMuted: false},
  {id: 5, x: -0.2, y: 0.2, strength: 1, isMuted: false},
  {id: 6, x: -0.8, y: -0.6, strength: 1, isMuted: false},
  {id: 7, x: 0.10, y: 0.10, strength: 1, isMuted: false},
]});
store.dispatch(setState(initialState));

ReactDOM.render(
  <Provider store={store}>
    <Editor />
  </Provider>,
  document.getElementById('app')
);
