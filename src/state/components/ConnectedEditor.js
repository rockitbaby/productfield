import {connect} from 'react-redux';
import * as actionCreators from '../action_creators'
import {Editor} from '../../components/Editor';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export const ConnectedEditor = connect(mapStateToProps, mapDispatchToProps)(Editor);
