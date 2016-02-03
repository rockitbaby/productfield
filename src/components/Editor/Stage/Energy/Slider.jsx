import React, {Component, PropTypes} from 'react';
import ReactSlider from 'react-slider';
import styles from './slider.css';

export class Slider extends Component {

  onSlide(value){
    this.props.onChange(value);
  }

  render() {
    return (
      <div className={this.props.isPresentationModeEnabled ? styles.sliderDark : styles.sliderLight}>
        <ReactSlider
          orientation='vertical'
          invert={true}
          withBars={true}
          min={-10}
          max={10}
          className={styles.wrapper}
          handleClassName={this.props.isPresentationModeEnabled ? styles.handleDark : styles.handleLight}
          handleActiveClassName={this.props.isPresentationModeEnabled ? styles.handleActiveDark : styles.handleActiveLight}
          barClassName={this.props.isPresentationModeEnabled ? styles.barDark : styles.barLight}
          onChange={this.onSlide.bind(this)}
          defaultValue={this.props.value}
          value={this.props.value} />
      </div>
    );
  }

}

Slider.propTypes = {
  isPresentationModeEnabled: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

Slider.defaultProps = {
  isPresentationModeEnabled: false,
  value: 0,
  onChange(value){},
};
