
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactSlider from 'react-slider';
import '../../styles/Slider.css';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <ReactSlider orientation={'horizontal'} />;
  },

});
