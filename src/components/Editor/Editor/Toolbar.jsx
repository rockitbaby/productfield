import React from 'react';
import GlobalStyles from '../../../styles/GlobalStyles';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../../../action_creators';

export const Toolbar = React.createClass({
  mixins: [PureRenderMixin],

  presentationButtonClick: function(){
    if(this.props.isPresentation == false) {
      console.log("StartPresentationMode");
      this.props.setPresentation(true);
    } else {
      console.log("EndPresentationMode");
      this.props.setPresentation(false);
    }
  },

  render: function() {
    const iconStyle = this.getIconStyle();

    return <div className="Editor-toolbar" style={this.getToolbarStyle()} >
            <div style={this.getContainerStyle('left')}>
              <a ><img src="img/share.svg" style={iconStyle}></img></a>
              <input type="text" style={this.getInputStyle()} placeholder={"Untitled Project"} />
            </div>
            <div style={this.getContainerStyle('right')}>
              <a><img src="img/map.svg" style={iconStyle}></img></a>
              <a onClick={this.presentationButtonClick}><img src="img/presentation.svg" style={iconStyle}></img></a>
            </div>
          </div>;
  },

  getBackgroundColor: function() {
    if(this.props.isPresentation)
      return GlobalStyles.backgroundDark;
    else
      return GlobalStyles.backgroundLight;
  },

  getToolbarStyle: function() {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '50',
      backgroundColor: this.getBackgroundColor(),
    }
  },

  getContainerStyle: function(position) {
    return {
      display: 'flex',
      justifyContent: 'space-around',
      minWidth: position == 'left' ? '25%' : '10%',
    }
  },

  getInputStyle: function() {
    return {
      border: '0',
      backgroundColor: GlobalStyles.backgroundGray,
    }
  },

  getIconStyle: function() {
    return {
      width: '24',
      height: '24',
    }
  }
});

function mapStateToProps(state) {
  return {
    isPresentation: state.get('isPresentation')
  };
}

export const ConnectedToolbar = connect(mapStateToProps, actionCreators)(Toolbar);
