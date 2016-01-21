import React from 'react';
import DefsComponent from './DefsComponent';
import DOMProperty from 'react/lib/DOMProperty';

function buildAllowedCustomAttribute(DOMProperty, customAttributes) {

  DOMProperty.injection.injectDOMPropertyConfig({
    isCustomAttribute(attributeName) {
      return (customAttributes.indexOf(attributeName) !== -1);
    },
  });

}

buildAllowedCustomAttribute(DOMProperty, ['filter', 'flood-color']);

export class Solid extends DefsComponent {

  renderDef(GU, offset) {
    /*eslint no-multi-spaces:0*/
    return  <filter key="lables-defs-filter" x="-0.1" y="-0.1" width="1.2" height="1.2" id="solid">
              <feFlood flood-color="white"/>
              <feComposite in="SourceGraphic"/>
            </filter>;
  }

}