import React from 'react';
import Slider from './EditBar/Slider'
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    const editBarStyle = this.getEditBarStyle();

    return <div className="force-field-edit-bar" style={editBarStyle} >
      <button onClick={this.props.addPoint}> Add Point</button>
      {this.props.editingPoint ?
        <div>
          <a href='#' onClick={() => this.props.setStrength(this.props.editingPoint.get('strength') + -1)}>reduce</a>
          <span>{this.props.editingPoint.get('strength')}</span>
          <a href='#' onClick={() => this.props.setStrength(this.props.editingPoint.get('strength') + 1)}>increase</a>

          <button onClick={this.props.deletePoint}>Delete</button>

        </div> : <div></div>}

    </div>;
  },

  getEditBarStyle: function() {
    return {
      height: '50',
      margin: '10px',
      marginBottom: '10',
      borderBottom: '1px solid grey',
      backgroundColor: 'lightgrey',
    }
  }
});
