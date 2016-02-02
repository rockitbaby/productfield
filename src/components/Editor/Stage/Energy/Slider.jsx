import React, {Component, PropTypes} from 'react';
import ReactSlider from 'react-slider';
import styles from './slider.css';

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
        className={this.props.isPresentation ? styles.sliderDark : styles.sliderLight}
        handleClassName={this.props.isPresentation ? styles.handleDark : styles.handleLight}
        handleActiveClassName={this.props.isPresentation ? styles.handleActiveDark : styles.handleActiveLight}
        barClassName={this.props.isPresentation ? styles.barDark : styles.barLight}
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
  onChange(value){},
};
