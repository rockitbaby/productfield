import React from 'react';
import Base from './Base';
import Anatomy from '../../ForceFieldAnatomy';


export class Circle extends Base {

  renderDef(GU, offset, origin, size) {
    /*eslint no-multi-spaces:0*/
    const radius = Anatomy.CENTER_RADIUS;
    return  <mask maskUnits="userSpaceOnUse" id="circle">
              <rect
                width={size.width}
                height={size.height}
                fill="#FFFFFF" />
              <circle cx={origin.x} cy={origin.y} r={radius * GU} fill="#000000"></circle>
            </mask>;
  }

}
