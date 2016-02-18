import React, {Component} from 'react';

export function StateProxy(component) {
  class StateProxy extends Component {

    constructor(props) {
      super(props);
      const stateProps = Object.assign({}, props.children.props);
      const resetComponentProps = this.resetProps(stateProps).bind(this);
      const initialState = Object.assign({}, stateProps, {resetComponentProps});
      this.state = initialState;
    }

    resetProps(props) {
      return () => {
        this.setState(props);
      };
    }

    render() {
      return React.cloneElement(
        React.Children.only(this.props.children),
        this.state,
      );
    }
  }

  const {type: {name}} = component;
  StateProxy.displayName = `StateProxy(${name})`;
  return (
    <StateProxy>
      {component}
    </StateProxy>
  );
}
