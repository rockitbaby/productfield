import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {Stage} from '../../components/Editor/ForceField/Stage';
import * as actionCreators from '../action_creators';

function mapStateToProps(state) {
  return {
    energies: state.get('energies').toJS(),
    isPresentation: state.get('isPresentation'),
    dragging: state.get('dragging')
  };
}

export const ConnectedStage = connect(mapStateToProps, actionCreators)(Stage);

