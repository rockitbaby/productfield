import {connect} from 'react-redux';
import * as actionCreators from '../action_creators'
import {Energy} from '../../components/Editor/ForceField/Energy';

function mapStateToProps(state, ownProps) {
  var energy = state.get('energies').find(function(energy) {
    return this.id == energy.get('id');
  }, ownProps);

  return {
    id: energy.get('id'),
    x: energy.get('x'),
    y: energy.get('y'),
    strength: energy.get('strength'),
    editingEnergy: state.get('editingEnergy'),
    startDragging: state.get('startDragging'),
    stopDragging: state.get('stopDragging'),
    isPresentation: state.get('isPresentation'),
    isMuted: energy.get('isMuted')
  };
}

export const ConnectedEnergy = connect(mapStateToProps, actionCreators)(Energy);
