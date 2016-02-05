import {connect} from 'react-redux';
import * as actionCreators from '../action_creators'
import {Editor} from '../../components/Editor';

function mapStateToProps(state) {
  return {
    isPresentationModeEnabled: state.get('isPresentation'),
    energies: state.get('energies').toJS(),
    isEnergyMoving: state.get('dragging'),
    editingEnergyId: state.get('editingEnergyId'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPresentationModeChange(presentationMode) {
      dispatch(actionCreators.setPresentation(presentationMode));
    },
    onEnergyEdit(energyId) {
      dispatch(actionCreators.setEditingEnergyId(energyId));
    },
    onEnergyMute(energyId) {
      dispatch(actionCreators.setEnergyIsMuted(energyId, true));
    },
    onEnergyUnmute(energyId) {
      dispatch(actionCreators.setEnergyIsMuted(energyId, false));
    },
    onEnergyStartMove() {
      dispatch(actionCreators.startDragging());
    },
    onEnergyStopMove() {
      dispatch(actionCreators.stopDragging());
    },
    onEnergyMove(energyId, x, y) {
      dispatch(actionCreators.moveEnergy(energyId, x, y));
    },
    onEnergyStrengthChange(energyId, strength) {
      dispatch(actionCreators.setEnergyStrength(energyId, strength));
    },
    onEnergyDelete(energyId) {
      dispatch(actionCreators.deleteEnergy(energyId));
    },
    onEnergyAdd(energy) {
      dispatch(actionCreators.addEnergy(energy));
    },
  };
}

export const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(Editor);
