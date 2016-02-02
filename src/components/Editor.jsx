import React, {Component, PropTypes} from 'react';
import {ConnectedStage} from '../state/components/ConnectedStage';
import {Toolbar} from './Editor/Toolbar';

export class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = this.browserWindowAsState();
  }

  browserWindowAsState() {
    const toolbarHeight = 100;
    return {
      stageHeight: window.innerHeight - toolbarHeight,
      stageWidth: window.innerWidth
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize(event) {
    this.setState(this.browserWindowAsState());
  }

  render() {
    return (
      <div className="Editor">
        <Toolbar
          isPresentationModeEnabled={this.props.isPresentationModeEnabled}
          onPresentationModeChange={this.props.onPresentationModeChange} />
        <ConnectedStage height={this.state.stageHeight} width={this.state.stageWidth} />
      </div>
    );
  }

}

Editor.propTypes = {
  isPresentationModeEnabled: Toolbar.propTypes.isPresentationModeEnabled,
  onPresentationModeChange: PropTypes.func,
};

Editor.defaultProps = {
  isPresentationModeEnabled: false,
  onPresentationModeChange(presentationMode){},
};
