import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose} from 'redux';
import {fromJS} from 'immutable';
import {ConnectedEditor} from './state/components/ConnectedEditor';
import reducer, {observeEnergies} from './state/reducer';
import {setState} from './state/action_creators'
import * as actionCreators from './state/action_creators'
import {ForceFieldCalculationSingleton, coordinateSystemTransformation} from './ForceFieldCalculation'

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
)(createStore);
const store = finalCreateStore(reducer);

const unsubscribeEnergiesObserver = observeEnergies(store, (energies) => {
  ForceFieldCalculationSingleton.getInstance().setEnergies(energies.toJS());
});

var initialState = fromJS({energies: [
  {id: '1', x: -1, y: -1, strength: 10, isMuted: false},
  {id: '2', x: 1, y: 1, strength: -10, isMuted: false},
]});
store.dispatch(setState(initialState));

ReactDOM.render(
  <ConnectedEditor store={store} />,
  document.getElementById('app')
);
