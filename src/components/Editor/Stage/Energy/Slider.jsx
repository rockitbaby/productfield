import React, {Component, PropTypes} from 'react';
import ReactSlider from 'react-slider';
import sliderStyles from './slider.css';

export class Slider extends Component {

  onSlide(value){
    this.props.onChange(value);
  }

  render() {
    return (
      <ReactSlider
        orientation='vertical'
        invert={true}
        withBars={true}
        min={-10}
        max={10}
        className={this.props.isPresentation ? " slider slider-dark" : "slider slider-light"}
        handleClassName={this.props.isPresentation ? " handle handle-dark" : "handle handle-light"}
        barClassName={this.props.isPresentation ? " bar bar-dark" : "bar bar-light"}
        onChange={this.onSlide.bind(this)}
        defaultValue={this.props.value}
        value={this.props.value} />
    );
  }

}

Slider.propTypes = {
  isPresentation: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

Slider.defaultProps = {
  isPresentation: false,
  value: 0,
  onChange(strength){},
};
