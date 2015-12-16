import React from 'react';
import Button from './EditBar/Button';
import Slider from './Slider';
import GlobalStyles from '../../styles/GlobalStyles';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
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
    const editBarStyle = this.getEditBarStyle();
    const InputStyle = this.getInputStyle();
    const IconStyle = this.getIconStyle();

    return <div className="force-field-edit-bar" style={editBarStyle} >
            <div className="row">
              <div className="col-md-1">
                <a className="btn btn-link"><img src="img/share.svg" style={IconStyle}></img></a>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="Text" style={InputStyle} placeholder={"Untitled Project"} />
              </div>
              <div className="col-md-2 col-md-offset-6">
                <div className="pull-right">
                  <a className="btn btn-link"><img src="img/map.svg" style={IconStyle}></img></a>
                  <a className="btn btn-link" onClick={this.presentationButtonClick}><img src="img/presentation.svg" style={IconStyle}></img></a>
                </div>
              </div>
            </div>
          </div>;
  },

  getBackgroundColor: function() {
    if(this.props.isPresentation)
      return GlobalStyles.backgroundDark;
    else
      return GlobalStyles.backgroundLight;
  },

  getEditBarStyle: function() {
    return {
      height: '50',
      padding: '10',
      backgroundColor: this.getBackgroundColor(),
    }
  },
  getInputStyle: function() {
    return {
      border: '0',
      backgroundColor: this.getBackgroundColor(),
    }
  },
  getIconStyle: function() {
    return {
      width: '24',
      height: '24',

    }
  }
});
