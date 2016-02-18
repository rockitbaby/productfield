import React from 'react';
import Base from './Base';
import Anatomy from '../../ForceFieldAnatomy';


export class Arrow extends Base {

  renderDef(_GU, _offset, _origin, _size) {
    return (
      <g id="arrow">
        <path fill="#444444" d="M4 13h2l5-5-5-5h-2l5 5z"></path>
      </g>
    );
  }

}
