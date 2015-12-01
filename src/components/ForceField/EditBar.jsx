import React from 'react';
import Button from './EditBar/Button';
import Slider from './Slider';
import GlobalStyles from '../../styles/GlobalStyles';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    const editBarStyle = this.getEditBarStyle();


    return <div className="force-field-edit-bar" style={editBarStyle} >
      <Button title='Add Point' clickAction={this.props.addPoint} />
      <Slider />
      {this.props.editingPoint ?
        <div>
          <a href='#' onClick={() => this.props.setStrength(this.props.editingPoint.get('strength') + -1)}>reduce</a>
          <span>{this.props.editingPoint.get('strength')}</span>
          <a href='#' onClick={() => this.props.setStrength(this.props.editingPoint.get('strength') + 1)}>increase</a>

          <Button title='Delete' clickAction={this.props.deletePoint} />
        </div> : <div></div>}
    </div>;
  },

  getEditBarStyle: function() {
    return {
      height: '50',
      margin: '10px',
      marginBottom: '10',
      backgroundColor: GlobalStyles.backgroundGray,

    }
  }
});
