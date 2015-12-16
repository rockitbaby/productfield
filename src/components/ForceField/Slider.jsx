
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactSlider from 'react-slider';
import '../../styles/Slider.css';


export default React.createClass({
  mixins: [PureRenderMixin],

  onChange: function(e){
    this.props.setStrength( e * -1);
  },

  render: function() {
    return <ReactSlider orientation = {'vertical'}
                        withBars
                        min = {-10}
                        max = {10}
                        className = {this.props.isPresentation? " slider slider-dark" : "slider slider-light"}
                        handleClassName = {this.props.isPresentation? " handle handle-dark" : "handle handle-light"}
                        barClassName = {this.props.isPresentation? " bar bar-dark" : "bar bar-light"}
                        onChange = {(e) => this.onChange(e)}
                        value = { (this.props.value * -1)}/>;
  },

});
