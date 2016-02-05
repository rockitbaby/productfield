import React, {Component} from 'react';

export function StateProxy(component) {
  class StateProxy extends Component {

    constructor(props) {
      super(props);
      let stateProps = Object.assign({}, props.children.props);
      let resetComponentProps = this.resetProps(stateProps).bind(this);
      let initialState = Object.assign({}, stateProps, {resetComponentProps});
      this.state = initialState;
    }

    resetProps(props) {
      return () => {
        this.setState(props);
      }
    }

    render() {
      return React.cloneElement(
        React.Children.only(this.props.children),
        this.state,
      );
    }
  }

  let {type: {name}} = component;
  StateProxy.displayName = `StateProxy(${name})`;
  return (
    <StateProxy>
      {component}
    </StateProxy>
  );
}
