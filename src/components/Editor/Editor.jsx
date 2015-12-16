import React from 'react';
import * as actionCreators from '../../action_creators'


import {ConnectedStage} from './ForceField/Stage';
import Toolbar from './Editor/Toolbar';

export default React.createClass({
  getInitialState: function() {
    return this.browserWindowAsState();
  },

  browserWindowAsState: function() {
    const toolbarHeight = 100;
    return {
      stageHeight: window.innerHeight - toolbarHeight,
      stageWidth: window.innerWidth
    }
  },

  render: function() {
    return <div className="Editor">
      <Toolbar setPresentation={this.props.setPresentation} />
      <ConnectedStage height={this.state.stageHeight} width={this.state.stageWidth} />
    </div>;
  },

  onResize: function() {
    this.setState(this.browserWindowAsState());
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.onResize);
  }
});
