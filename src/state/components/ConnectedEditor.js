import {connect} from 'react-redux';
import * as actionCreators from '../action_creators'
import {Editor} from '../../components/Editor';

function mapStateToProps(state) {
  return {
    isPresentationModeEnabled: state.get('isPresentation')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPresentationModeChange(presentationMode) {
      dispatch(actionCreators.setPresentation(presentationMode));
    }
  };
}

export const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(Editor);
