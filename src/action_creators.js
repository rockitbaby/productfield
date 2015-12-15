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

export function exitEdit() {
  return {
    type: 'EXIT_EDIT',
  };
}

export function deletePoint() {
  return {
    type: 'DELETE_POINT'
  };
}

export function addPoint(point) {
  return {
    type: 'ADD_POINT',
    point
  };
}

export function setStrength(strength) {
  return {
    type: 'SET_STRENGTH',
    strength
  };
}
export function setLastRenderTimestamp(timestamp) {
  return {
    type: 'SET_TIMESTAMP',
    timestamp
  };
}
export function setPresentation(presentation) {
  return {
    type: 'SET_PRESENTATION',
    presentation
  };
}
