import {Map} from 'immutable';
import {ForceFieldCalculationSingleton, coordinateSystemTransformation} from './ForceFieldCalculation'

function setState(state, newState) {
  var calculationPoints = coordinateSystemTransformation(newState.get('points').toJS())
  ForceFieldCalculationSingleton.getInstance().setEnergies(calculationPoints);

  return state.merge(newState);
}

function movePoint(state, newPoint) {
  state.set('editingPoint', newPoint)
  var newPoints = state.get('points').map(function(point) {
    if (point.get('id') == newPoint.id) {
      return point.merge(newPoint);
    } else {
      return point
    }
  });

  return state.set('points', newPoints);
}

function addPoint(state, point) {
  var currentPoints = state.get('points');
  var nextID = (currentPoints.size > 0) ? (currentPoints.max().get('id') + 1) : 1;
  var newPoints = currentPoints.push(Map({id: nextID, x: point.x, y: point.y, strength: 0}));
  return state.set('points', newPoints);
}

function editPoint(state, point) {
  return state.set('editingPoint', point)
}

function exitEdit(state) {
  return state.set('editingPoint', null)
}

function setLastRenderTimestamp(state, timestamp) {
  return state.set('lastTimestamp', timestamp)
}

function setPresentationState(state, presentation = false) {
  return state.set('isPresentation', presentation)
}

function deletePoint(state) {
  var deletingPointId = state.getIn(['editingPoint', 'id'])
  var newPoints = state.get('points').filter(function(point) {
    return point.get('id') !== deletingPointId;
  });
  return state.set('editingPoint', null).set('points', newPoints);
}

function setStrength(state, newStrength) {
  var pointId = state.getIn(['editingPoint', 'id'])

  var newPoints = state.get('points').map(function(point) {
    if (point.get('id') == pointId) {
      return point.set('strength', newStrength);
    } else {
      return point
    }
  });

  return state.setIn(['editingPoint', 'strength'], newStrength).set('points', newPoints);
}

export default function(state = Map(), action) {
  switch (action.type) {
  case 'SET_STATE':
    return setState(state, action.state);
  case 'MOVE_POINT':
    return setState(state, movePoint(state, action.point));
  case 'ADD_POINT':
    return setState(state, addPoint(state,action.point));
  case 'DELETE_POINT':
    return setState(state, deletePoint(state))
  case 'EDIT_POINT':
    return setState(state, editPoint(state, action.point))
  case 'SET_STRENGTH':
    return setState(state, setStrength(state, action.strength))
  case 'SET_TIMESTAMP':
    return setState(state, setLastRenderTimestamp(state, action.timestamp))
  case 'SET_PRESENTATION':
    return setState(state, setPresentationState(state, action.presentation))
  case 'EXIT_EDIT':
    return setState(state, exitEdit(state))
  }

  return state;
}
