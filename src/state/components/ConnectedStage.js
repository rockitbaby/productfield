import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {Stage} from '../../components/Editor/ForceField/Stage';
import * as actionCreators from '../action_creators';

function mapStateToProps(state) {
  return {
    energies: state.get('energies').toJS(),
    isPresentation: state.get('isPresentation'),
    isEnergyMoving: state.get('dragging'),
    editingEnergyId: state.get('editingEnergyId'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addEnergy(energy) {
      dispatch(actionCreators.addEnergy(energy));
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
    }
  };
}

export const ConnectedStage = connect(mapStateToProps, mapDispatchToProps)(Stage);

