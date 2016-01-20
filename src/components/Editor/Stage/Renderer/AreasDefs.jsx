import React, {Component, PropTypes} from 'react';

export class AreasDefsCrosshatch extends Component {

  render() {

    return (
      <pattern key="areas-defs-crosshatch" id="Crosshatch"
               width="8" height="8"
               patternUnits="userSpaceOnUse">
        <path className="Pattern-crosshatch" d='M0 0L8 8ZM8 0L0 8Z' stroke-width='1' />
      </pattern>
    );
  }

}

AreasDefsCrosshatch.propTypes = {
  gridUnit: PropTypes.number.isRequired,
};

export class AreasDefsStripe extends Component {

  render() {
    return (
      <pattern key="areas-defs-stripe" id="Stripe"
               width="10" height="10"
               patternUnits="userSpaceOnUse">
        <path d='M-1,1 l2,-2
           M0,10 l10,-10
           M9,11 l2,-2' stroke='#000000' stroke-width='0.5'/>
      </pattern>
    );
  }

}

AreasDefsStripe.propTypes = {
  gridUnit: PropTypes.number.isRequired,
};
