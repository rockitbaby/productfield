import React, {Component, PropTypes} from 'react';
import GlobalStyles from '../../styles/GlobalStyles';
import {connect} from 'react-redux';
import * as actionCreators from '../../state/action_creators';
import styles from './Toolbar/toolbar.css';

export class Toolbar extends Component {

  getBackgroundColor() {
    if (this.props.isPresentation)
      return GlobalStyles.backgroundDark;
    else
      return GlobalStyles.backgroundLight;
  }

  getToolbarStyle() {
    return {
      backgroundColor: this.getBackgroundColor(),
    }
  }

  getContainerStyle(position) {
    return {
      minWidth: position == 'left' ? '25%' : '10%',
    }
  }

  getInputStyle() {
    return {
      border: '0',
      backgroundColor: GlobalStyles.backgroundGray,
    }
  }

  presentationButtonClick() {
    const {isPresentation, setPresentation} = this.props;
    if (isPresentation == false) {
      console.log("StartPresentationMode");
      setPresentation(true);
    } else {
      console.log("EndPresentationMode");
      setPresentation(false);
    }
  }

  render() {
    return (
      <div className={["Editor-toolbar", styles.toolbar].join(' ')} style={this.getToolbarStyle()} >
        <div className={styles.container} style={this.getContainerStyle('left')}>
          <a >
            <img src="img/share.svg" className={styles.icon}/>
          </a>
          <input type="text" style={this.getInputStyle()} placeholder={"Untitled Project"} />
        </div>
        <div className={styles.container} style={this.getContainerStyle('right')}>
          <a>
            <img src="img/map.svg" className={styles.icon}/>
          </a>
          <a onClick={this.presentationButtonClick.bind(this)}>
            <img src="img/presentation.svg" className={styles.icon}/>
          </a>
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  isPresentation: PropTypes.bool,
  setPresentation: PropTypes.func,
};

Toolbar.defaultProps = {
  isPresentation: false,
  setPresentation(presentationMode){},
}
