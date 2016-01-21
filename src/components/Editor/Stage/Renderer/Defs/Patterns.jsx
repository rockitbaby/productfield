import React from 'react';
import DefsComponent from './DefsComponent';


export class Crosshatch extends DefsComponent {

  renderDef(GU, offset) {
    /*eslint no-multi-spaces:0*/
    return  <pattern key="defs-crosshatch" id="Crosshatch" 
              width="8" height="8"
              patternUnits="userSpaceOnUse">
                <path className="Pattern-crosshatch" d='M0 0L8 8ZM8 0L0 8Z' stroke-width='1' />
            </pattern>;
  }

}

export class Stripe extends DefsComponent {

  renderDef(GU, offset) {
    /*eslint no-multi-spaces:0*/
    return  <pattern key="defs-stripe" id="Stripe" 
              width="10" height="10"
              patternUnits="userSpaceOnUse">
               <path d='M-1,1 l2,-2M0,10 l10,-10M9,11 l2,-2'
                 stroke='#000000' stroke-width='0.5'/>
            </pattern>;
  }

}

export class Dots extends DefsComponent {

  renderDef(GU, offset) {
    /*eslint no-multi-spaces:0*/
    const radius = 1;
    return  <pattern key="defs-dots" id="dots"
              x={offset.x} y={offset.y} width={GU} height={GU}
              patternUnits="userSpaceOnUse">
                <circle className="off" cx={GU / 2} cy={GU / 2} r={radius} fill="#000000" stroke="none"></circle>
            </pattern>;
  }

}