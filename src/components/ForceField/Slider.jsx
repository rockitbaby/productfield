
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactSlider from 'react-slider';
import '../../styles/Slider.css';

export default React.createClass({
  mixins: [PureRenderMixin],

  onChange: function(e){
    console.log("onChange!");
    console.log(e);
    this.props.setValue(e-10);
  },

  render: function() {
    // value={this.props.editingPoint.get('strength')}
    return <ReactSlider orientation = {'vertical'}
                        withBars
                        min = {0}
                        max = {20}
                        onChange = {(e) => this.onChange(e)}
                        value = { (this.props.value + 10)}/>;
  },

});
