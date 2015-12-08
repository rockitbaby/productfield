
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    const buttonStyle = this.getButtonStyle();

    return <a className="force-field-edit-bar-button" style={buttonStyle} onClick={this.props.clickAction}>{this.props.title}</a>;
  },

  getButtonStyle: function() {
    return {
      cursor: 'pointer',
      border: 'none',
    }
  }
});
