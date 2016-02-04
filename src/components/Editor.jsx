import React, {Component, PropTypes} from 'react';
import {Stage} from './Editor/Stage';
import {Toolbar} from './Editor/Toolbar';

export class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = this.browserWindowAsState();
  }

  browserWindowAsState() {
    const toolbarHeight = 50;
    return {
      stageHeight: window.innerHeight - toolbarHeight - 5,
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
        <Stage
          height={this.state.stageHeight}
          width={this.state.stageWidth}
          energies={this.props.energies}
          isPresentationModeEnabled={this.props.isPresentationModeEnabled}
          editingEnergyId={this.props.editingEnergyId}
          isEnergyMoving={this.props.isEnergyMoving}
          onEnergyAdd={this.props.onEnergyAdd}
          onEnergyEdit={this.props.onEnergyEdit}
          onEnergyMute={this.props.onEnergyMute}
          onEnergyUnmute={this.props.onEnergyUnmute}
          onEnergyStartMove={this.props.onEnergyStartMove}
          onEnergyStopMove={this.props.onEnergyStopMove}
          onEnergyMove={this.props.onEnergyMove}
          onEnergyStrengthChange={this.props.onEnergyStrengthChange}
          onEnergyDelete={this.props.onEnergyDelete}
        />
      </div>
    );
  }

}

Editor.propTypes = {
  isPresentationModeEnabled: PropTypes.bool,
  energies: Stage.propTypes.energies,
  isEnergyMoving: Stage.propTypes.isEnergyMoving,
  editingEnergyId: Stage.propTypes.editingEnergyId,
  onPresentationModeChange: PropTypes.func,
  onEnergyAdd: Stage.propTypes.onEnergyAdd,
  onEnergyEdit: Stage.propTypes.onEnergyEdit,
  onEnergyMute: Stage.propTypes.onEnergyMute,
  onEnergyUnmute: Stage.propTypes.onEnergyUnmute,
  onEnergyStartMove: Stage.propTypes.onEnergyStartMove,
  onEnergyStopMove: Stage.propTypes.onEnergyStopMove,
  onEnergyMove: Stage.propTypes.onEnergyMove,
  onEnergyStrengthChange: Stage.propTypes.onEnergyStrengthChange,
  onEnergyDelete: Stage.propTypes.onEnergyDelete,
};

Editor.defaultProps = {
  isPresentationModeEnabled: false,
  energies: Stage.defaultProps.energies,
  isEnergyMoving: Stage.defaultProps.isEnergyMoving,
  editingEnergyId: Stage.defaultProps.editingEnergyId,
  onPresentationModeChange(presentationMode){},
  onEnergyAdd: Stage.defaultProps.onEnergyAdd,
  onEnergyEdit: Stage.defaultProps.onEnergyEdit,
  onEnergyMute: Stage.defaultProps.onEnergyMute,
  onEnergyUnmute: Stage.defaultProps.onEnergyUnmute,
  onEnergyStartMove: Stage.defaultProps.onEnergyStartMove,
  onEnergyStopMove: Stage.defaultProps.onEnergyStopMove,
  onEnergyMove: Stage.defaultProps.onEnergyMove,
  onEnergyStrengthChange: Stage.defaultProps.onEnergyStrengthChange,
  onEnergyDelete: Stage.defaultProps.onEnergyDelete,
};
