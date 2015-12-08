import React from 'react';
import Button from './EditBar/Button';
import Slider from './Slider';
import GlobalStyles from '../../styles/GlobalStyles';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    const editBarStyle = this.getEditBarStyle();
    const InputStyle = this.getInputStyle();
    const IconStyle = this.getIconStyle();

    // <a href='#' onClick={() => this.props.setStrength(this.props.editingPoint.get('strength') + -1)}>reduce</a>
    // <a href='#' onClick={() => this.props.setStrength(this.props.editingPoint.get('strength') + 1)}>increase</a>
    // <span>{this.props.editingPoint.get('strength')}</span>

    return <div className="force-field-edit-bar" style={editBarStyle} >
            <div className="row">
              <div className="col-md-1">
                <button><span className="glyphicon glyphicon-share" style={IconStyle}/></button>
              </div>
              <div className="col-md-9">
                <input type="Text" style={InputStyle} placeholder={"Untitled Project"} />
              </div>
              <div className="col-md-1">
                <button><span className="glyphicon glyphicon-edit" style={IconStyle}/></button>
              </div>
              <div className="col-md-1">
                <button><span className="glyphicon glyphicon-eye-open" style={IconStyle}/></button>
              </div>
            </div>
      <Button title='Add Point' clickAction={this.props.addPoint} />
    </div>;
  },

  getEditBarStyle: function() {
    return {
      height: '50',
      marginBottom: '20',
      padding: '10',
      backgroundColor: GlobalStyles.backgroundGray,

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

    }
  }
});
