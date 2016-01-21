import {PropTypes} from 'react';


function isPoint(isRequired, props, propName, componentName = 'ANONYMOUS') {
  if (props[propName] == null) {

    if(isRequired) {
      return new Error(
          ("Required `" + propName + "` was not specified in ") +
          ("`" + componentName + "`.")
        );
    }
    return null;
  }
  let value = props[propName];
  return (value.x && value.y) ? null : new Error(propName + ' in ' + componentName + " must be a point");
}

function isSize(isRequired, props, propName, componentName = 'ANONYMOUS') {
  if (props[propName] == null) {

    if(isRequired) {
      return new Error(
          ("Required `" + propName + "` was not specified in ") +
          ("`" + componentName + "`.")
        );
    }
    return null;
  }
  let value = props[propName];
  return (value.width && value.height) ? null : new Error(propName + ' in ' + componentName + " must be a size");
}

function buildChainPropTypeValidation(func) {
  let chained = func.bind(null, false);
  chained.isRequired = func.bind(null, true);
  return chained;
}

var AppPropTypes = Object.assign(PropTypes, {
  point: buildChainPropTypeValidation(isPoint),
  size: buildChainPropTypeValidation(isSize),
})

export default AppPropTypes;