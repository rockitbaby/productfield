import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {
  setEnergyStrength,
  setEditingEnergyId,
  setEnergyIsMuted,
  moveEnergy,
  deleteEnergy,
} from '../src/state/action_creators';

import reducer from '../src/state/reducer';

const suite = describe;
const test = it;

suite('reducer', () => {

  test('state initialization', () => {
    const endState = Map({
      energies: List(),
      editingEnergyId: null,
    });

    const result = reducer(undefined, {});

    expect(result).to.equal(endState);
  });

  test('SET_ENERGY_STRENGTH action', () => {
    const startState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.1,
          y: 0.3,
          strength: 1,
        }),
      ]),
    });

    const endState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.1,
          y: 0.3,
          strength: 5,
        }),
      ]),
    });

    const nextState = reducer(startState, setEnergyStrength(2, 5));

    expect(nextState).to.equal(endState);
  });

  test('SET_EDITING_ENERGY_ID action', () => {
    const startState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.1,
          y: 0.3,
          strength: 5,
          isMuted: false,
        }),
      ]),
    });

    const endState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.1,
          y: 0.3,
          strength: 5,
          isMuted: true,
        }),
      ]),
    });

    const nextState = reducer(startState, setEnergyIsMuted(2, true));

    expect(nextState).to.equal(endState);
  });

  test('SET_ENERGY_MUTE action', () => {
    const startState = Map({
      editingEnergyId: null,
    });

    const endState = Map({
      editingEnergyId: 2,
    });

    const nextState = reducer(startState, setEditingEnergyId(2));

    expect(nextState).to.equal(endState);
  });

  test('MOVE_ENERGY action', () => {
    const startState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.1,
          y: 0.3,
          strength: 5,
          isMuted: true,
        }),
      ]),
    });

    const endState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.8,
          y: 0.9,
          strength: 5,
          isMuted: true,
        }),
      ]),
    });

    const nextState = reducer(startState, moveEnergy(2, 0.8, 0.9));

    expect(nextState).to.equal(endState);
  });

  test('DELETE_ENERGY action', () => {
    const startState = Map({
      energies: List([
        Map({
          id: 2,
          x: 0.1,
          y: 0.3,
          strength: 5,
          isMuted: true,
        }),
      ]),
      editingEnergyId: 2,
    });

    const endState = Map({
      energies: List([]),
      editingEnergyId: null,
    });

    const nextState = reducer(startState, deleteEnergy(2));

    expect(nextState).to.equal(endState);
  });

  it('handles SET_STATE', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: fromJS({ energies: [{id:1}, {id: 2}] })
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({ energies: [{id:1}, {id: 2}] }));
  });

  it('handles SET_STATE with plain JS payload', () => {
    const initialState = Map();
    const action = {
      type: 'SET_STATE',
      state: { energies: [{id:1}, {id: 2}] }
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({ energies: [{id:1}, {id: 2}] }));
  });

  it('handles SET_STATE without initial state', () => {
    const action = {
      type: 'SET_STATE',
      state: { points: [{id:1}, {id: 2}] }
    };
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({ energies: [], editingEnergyId: null, points: [{id:1}, {id: 2}] }));
  });

  xit('handles DRAG_POINT by setting new coordinates for the point', () => {
    const state = fromJS({ points: [{id: 1, x: 20, y: 40}, {id: 2, x: 30, y: 70}] });

    const action = {type: 'DRAG_POINT', id: 2, pointDOMNode: {}, fieldDOMNode: {}};
    const nextState = reducer(state, action);

    expect(nextState).to.equal(fromJS({ points: [{id: 1, x: 20, y: 40}, {id: 2, x: 30, y: 70}] }));
  });
});
