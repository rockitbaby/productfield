import React from 'react';
import Base from './Base';


export class Crosshatch extends Base {

  renderDef(_GU, _offset, _origin, _size) {
    return (
      <pattern key="defs-crosshatch" id="Crosshatch"
        width="8" height="8"
        patternUnits="userSpaceOnUse">
        <path className="Pattern-crosshatch" d='M0 0L8 8ZM8 0L0 8Z' stroke='#000000' strokeWidth='0.5' />
      </pattern>
      );
  }

}

export class Stripe extends Base {

  renderDef(_GU, _offset, _origin, _size) {
    return (
      <pattern key="defs-stripe" id="Stripe"
        width="10" height="10"
        patternUnits="userSpaceOnUse">
        <path d='M-1,1 l2,-2M0,10 l10,-10M9,11 l2,-2'
          stroke='#000000' strokeWidth='0.5'/>
      </pattern>
      );
  }

}

export class Dots extends Base {

  renderDef(GU, _offset, _origin, _size) {
    const radius = 1;
    const patternWidth = 1;
    const dotCenter = 0.5;
    return (
      <pattern key="defs-dots" id="dots"
        width={patternWidth * GU} height={patternWidth * GU}
        patternUnits="userSpaceOnUse">
        <circle className="off"
          cx={dotCenter * GU} cy={dotCenter * GU} r={radius}
          fill="#000000" stroke="none"/>
      </pattern>
    );
  }

}
