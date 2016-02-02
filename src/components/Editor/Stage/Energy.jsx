import React, {Component, PropTypes} from 'react';
import {fromJS, Map} from 'immutable';
import {DraggableCore} from 'react-draggable';
import GlobalStyles from '../../../styles/GlobalStyles'
import {Slider} from './Energy/Slider';
import styles from './Energy/energy.css';

export class Energy extends Component {

  getCircleStyle() {
    const backgroundColor = (strength, isMuted) => {
      if (isMuted) {
        return GlobalStyles.neutralGrey;
      } else {
        if (strength > 0) {
          return GlobalStyles.lightGreen;
        } else if (strength < 0) {
          return GlobalStyles.lightRed;
        } else {
          return GlobalStyles.neutralGrey;
        }
      }
    }

    const circleStyles = {
      backgroundColor:  backgroundColor(this.props.strength, this.props.isMuted),
    }
    return circleStyles;
  }

  renderEnergyEditor() {
    return (
      <div className={["Energy-pane", styles.editingPane].join(' ')} >
        <Slider value={this.props.strength}
          onChange={this.props.onStrengthChange}
          isPresentation={this.props.isPresentation}/>
        <div className={this.props.isPresentation ? styles.sliderAdditionDark : styles.sliderAdditionLight}>
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

  render() {
    return (
      <div className={["Energy", this.props.isEditing ? styles.wrapperEditing : styles.wrapper].join(' ')}>
        <div
          className={["Energy-circle", this.props.isEditing ? styles.circleEditing : styles.circle].join(' ')}
          style={this.getCircleStyle()}
          onClick={this.props.onEdit} >
          <span>{this.props.strength}</span>
        </div>
        { this.props.isEditing ? this.renderEnergyEditor() : null }
      </div>
    );
  }

}

Energy.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  strength: PropTypes.number.isRequired,
  isPresentation: PropTypes.bool,
  isMuted: PropTypes.bool,
  isEditing: PropTypes.bool,
  deNormalizeCoordinates: PropTypes.func.isRequired,
  normalizeCoordinates: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onMute: PropTypes.func,
  onUnmute: PropTypes.func,
  onStrengthChange: PropTypes.func,
  onDelete: PropTypes.func,
};

Energy.defaultProps = {
  isPresentation: false,
  isMuted: false,
  isEditing: false,
  onEdit(event){},
  onMute(){},
  onUnmute(){},
  onStrengthChange(strength){},
  onDelete(){},
};
