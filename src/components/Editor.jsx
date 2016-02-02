import React from 'react';
import {ConnectedStage} from '../state/components/ConnectedStage';
import {ConnectedToolbar} from '../state/components/ConnectedToolbar';

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
