import React, {Component, PropTypes} from 'react';
import GlobalStyles from '../../../styles/GlobalStyles'
import styles from './energy.css';

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

  render() {
    return (
      <div
        className={["Energy", this.props.isEditing ? styles.wrapperEditing : styles.wrapper].join(' ')} >
        <div
          className={["Energy-circle", this.props.isEditing ? styles.circleEditing : styles.circle].join(' ')}
          style={this.getCircleStyle()}
          onClick={this.props.onEdit} >
          <span>{this.props.strength}</span>
        </div>
      </div>
    );
  }

}

Energy.propTypes = {
  strength: PropTypes.number.isRequired,
  isMuted: PropTypes.bool,
  isEditing: PropTypes.bool,
  onEdit: PropTypes.func,
};

Energy.defaultProps = {
  isMuted: false,
  isEditing: false,
  onEdit(event){},
};
