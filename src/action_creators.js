export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

export function movePoint(point) {
  return {
    type: 'MOVE_POINT',
    point
  };
}

export function editPoint(point) {
  return {
    type: 'EDIT_POINT',
    point
  };
}

export function deletePoint() {
  return {
    type: 'DELETE_POINT'
  };
}

export function addPoint() {
  return {
    type: 'ADD_POINT'
  }
}

export function setStrength(strength) {
  return {
    type: 'SET_STRENGTH',
    strength
  };
}
