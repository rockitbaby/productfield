import React from 'react';
import {ConnectedToolbar} from './Editor/Toolbar';
import {ConnectedStage} from '../../state/components/connected_stage';

export const Editor = React.createClass({
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
    return (
      <div className="Editor">
        <ConnectedToolbar />
        <ConnectedStage height={this.state.stageHeight} width={this.state.stageWidth} />
      </div>
    );
  },

  onResize: function(event) {
    this.setState(this.browserWindowAsState());
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.onResize);
  }
});
