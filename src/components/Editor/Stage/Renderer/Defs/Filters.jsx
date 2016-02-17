import React from 'react';
import {allowCustomAttributes} from 'utils';
import DefsComponent from './DefsComponent';
import DOMProperty from 'react/lib/DOMProperty';

allowCustomAttributes(DOMProperty, ['in', 'filter', 'flood-color']);

export class Solid extends DefsComponent {

  renderDef(_gridUnit, _offset) {
    /*eslint no-multi-spaces:0*/
    return  <filter key="lables-defs-filter" x="-0.1" y="-0.1" width="1.2" height="1.2" id="solid">
              <feFlood flood-color="white"/>
              <feComposite in="SourceGraphic"/>
            </filter>;
  }

}
