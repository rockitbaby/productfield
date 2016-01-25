import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactSlider from 'react-slider';
import sliderStyles from '../../../../styles/Slider.css';


export default React.createClass({
  mixins: [PureRenderMixin],

  onSlide: function(e){
    this.props.setStrength(e * -1);
  },

  render: function() {
    return (
      <ReactSlider
        orientation = {'vertical'}
        withBars
        min = {-10}
        max = {10}
        className = {this.props.isPresentation? " slider slider-dark" : "slider slider-light"}
        handleClassName = {this.props.isPresentation? " handle handle-dark" : "handle handle-light"}
        barClassName = {this.props.isPresentation? " bar bar-dark" : "bar bar-light"}
        onChange = {this.onSlide}
        value = { (this.props.value * -1)} />
    );
  },

});
