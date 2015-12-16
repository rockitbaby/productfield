export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

export function moveEnergy(energy) {
  return {
    type: 'MOVE_ENERGY',
    energy
  };
}

export function editEnergy(energy) {
  return {
    type: 'EDIT_ENERGY',
    energy
  };
}

export function startDragging() {
  return {
    type: 'START_DRAGGING'
  };
}

export function stopDragging() {
  return {
    type: 'STOP_DRAGGING'
  };
}

export function deleteEnergy() {
  return {
    type: 'DELETE_ENERGY'
  };
}

export function addEnergy(energy) {
  return {
    type: 'ADD_ENERGY',
    energy
  };
}

export function setStrength(strength) {
  return {
    type: 'SET_STRENGTH',
    strength
  };
}

export function setPresentation(presentation) {
  return {
    type: 'SET_PRESENTATION',
    presentation
  };
}
