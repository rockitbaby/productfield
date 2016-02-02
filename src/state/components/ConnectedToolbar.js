import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';
import {Toolbar} from '../../components/Editor/Toolbar';

function mapStateToProps(state) {
  return {
    isPresentation: state.get('isPresentation')
  };
}

export const ConnectedToolbar = connect(mapStateToProps, actionCreators)(Toolbar);
