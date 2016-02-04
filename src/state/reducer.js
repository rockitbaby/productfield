import Immutable, {Map, List} from 'immutable';
import {
  SET_ENERGY_STRENGTH,
  SET_EDITING_ENERGY_ID,
  SET_ENERGY_IS_MUTED,
  SET_STATE,
  MOVE_ENERGY,
  EDIT_ENERGY,
  START_DRAGGING,
  STOP_DRAGGING,
  DELETE_ENERGY,
  ADD_ENERGY,
  SET_STRENGTH,
  SET_PRESENTATION,
  SET_MUTE,
} from './action_types';

function setState(state, newState) {
  return state.merge(newState);
}

function addEnergy(state, energy) {
  return state.update('energies', (energies) => energies.push(Map(energy)));
}

function setPresentation(state, presentation = false) {
  return state.set('isPresentation', presentation)
}

function setEnergyStrength(state, energyId, newStrength) {
  const energyIndex = state.get('energies', List()).findIndex((energy) => energy.get('id') === energyId);
  if (energyIndex !== -1) {
    return state.setIn(['energies', energyIndex, 'strength'], newStrength);
  } else {
    return state;
  }
}

function setEditingEnergyId(state, energyId) {
  return state.set('editingEnergyId', energyId);
}

function setEnergyIsMuted(state, energyId, isMuted) {
  const energyIndex = state.get('energies', List()).findIndex((energy) => energy.get('id') === energyId);
  if (energyIndex !== -1) {
    return state.setIn(['energies', energyIndex, 'isMuted'], isMuted);
  } else {
    return state;
  }
}

function moveEnergy(state, energyId, x, y) {
  const energyIndex = state.get('energies', List()).findIndex((energy) => energy.get('id') === energyId);
  if (energyIndex !== -1) {
    return state
      .setIn(['energies', energyIndex, 'x'], x)
      .setIn(['energies', energyIndex, 'y'], y);
  } else {
    return state;
  }
}

function deleteEnergy(state, energyId) {
  const filteredEnergies = state.get('energies').filter((energy) => energy.get('id') !== energyId );
  return state
    .set('editingEnergyId', null)
    .set('energies', filteredEnergies);
}

const appState = Map({
  energies: List(),
  editingEnergyId: null,
})

export default function(state = appState, action) {
  switch (action.type) {
  case SET_STATE:
    return setState(state, action.state);
  case MOVE_ENERGY:
    return moveEnergy(state, action.id, action.x, action.y);
  case ADD_ENERGY:
    return setState(state, addEnergy(state, action.energy));
  case DELETE_ENERGY:
    return deleteEnergy(state, action.id);
  case START_DRAGGING:
    return setState(state, state.set('dragging', true));
  case STOP_DRAGGING:
    return setState(state, state.set('dragging', false));
  case SET_PRESENTATION:
    return setState(state, setPresentation(state, action.presentation));
  case SET_ENERGY_STRENGTH:
    return setEnergyStrength(state, action.id, action.strength);
  case SET_EDITING_ENERGY_ID:
    return setEditingEnergyId(state, action.id);
  case SET_ENERGY_IS_MUTED:
    return setEnergyIsMuted(state, action.id, action.isMuted);
  default:
    return state;
  }
}

export function observeEnergies(store, onChange) {
  return observeStore(store, (state) => state.get('energies'), onChange);
}

export function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    const nextState = select(store.getState());
    if (!Immutable.is(nextState, currentState)) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
