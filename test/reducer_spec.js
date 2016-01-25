import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/state/reducer';

describe('reducer', () => {

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

    expect(nextState).to.equal(fromJS({ points: [{id:1}, {id: 2}] }));
  });

  it('handles DRAG_POINT by setting new coordinates for the point', () => {
    const state = fromJS({ points: [{id: 1, x: 20, y: 40}, {id: 2, x: 30, y: 70}] });

    const action = {type: 'DRAG_POINT', id: 2, pointDOMNode: point, fieldDOMNode: field};
    const nextState = reducer(state, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1}
      },
      hasVoted: 'Trainspotting'
    }));
  });
});
