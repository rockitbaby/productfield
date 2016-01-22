import React from 'react';
import DefsComponent from './DefsComponent';
import Anatomy from 'ForceFieldAnatomy';


export class Arrow extends DefsComponent {

  renderDef(GU, offset, origin, size) {
    /*eslint no-multi-spaces:0*/
    const radius = 2;
    return  <g id="arrow">
              <path fill="#444444" d="M4 13h2l5-5-5-5h-2l5 5z"></path>
            </g>;
  }

}