import React, {Component, PropTypes} from 'react';
import {Slider} from './EnergyEditor/Slider';
import styles from './energy_editor.css';

export class EnergyEditor extends Component {

  render() {
    return (
      <div className={["Energy-pane", styles.editingPane].join(' ')} >
        <Slider value={this.props.strength}
          onChange={this.props.onStrengthChange}
          isPresentationModeEnabled={this.props.isPresentationModeEnabled}/>
        <div className={this.props.isPresentationModeEnabled ? styles.sliderAdditionDark : styles.sliderAdditionLight}>
          <div className={styles.sliderAdditionIconWrapper}>
            <img className={styles.sliderAdditionIcon} src="/img/delete.svg" onClick={this.props.onDelete}/>
          </div>
          <div className={styles.sliderAdditionIconWrapper}>
            {this.props.isMuted ?
            <img className={styles.sliderAdditionIcon} src="/img/unmute.svg" onClick={this.props.onUnmute}/>
            :
            <img className={styles.sliderAdditionIcon} src="/img/mute.svg" onClick={this.props.onMute}/>
            }
          </div>
        </div>
      </div>
    );
  }

}

EnergyEditor.propTypes = {
  energyId: PropTypes.string.isRequired,
  isPresentationModeEnabled: PropTypes.bool,
  strength: PropTypes.number.isRequired,
  isMuted: PropTypes.bool,
  onMute: PropTypes.func,
  onUnmute: PropTypes.func,
  onStrengthChange: PropTypes.func,
  onDelete: PropTypes.func,
};

EnergyEditor.defaultProps = {
  isPresentationModeEnabled: false,
  isMuted: false,
  onMute(){},
  onUnmute(){},
  onStrengthChange(strength){},
  onDelete(){},
};
