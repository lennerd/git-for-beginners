import React, { Component } from "react";
import { Transition } from 'react-transition-group';

import PopmotionAction from "./PopmotionAction";

class PopmotionTransition extends Component {
  static defaultProps = {
    onEnter: () => {},
    onExit: () => {},
  };

  constructor(props) {
    super();

    const { defaultValues } = props;

    this.state = {
      value: defaultValues.exit
    }
  }

  addEndListener = (node, done) => {
    const { completed } = this.state;

    if (!completed) {
      this.setState({ done });
    } else {
      done();
    }
  };

  handleEnter = (...args) => {
    const { actions, values, onEnter } = this.props;

    this.setState({
      action: actions.enter,
      value: values.enter,
      completed: false,
    });

    onEnter(...args);
  };

  handleExit = (...args) => {
    const { actions, values, onExit } = this.props;

    this.setState({
      action: actions.exit,
      value: values.exit,
      completed: false,
    });

    onExit(...args);
  };

  handleComplete = () => {
    const { done } = this.state;

    this.setState({
      completed: true,
    });

    if (done != null) {
      done();
    }
  };

  render() {
    const { children, ...props } = this.props;
    const { value, action } = this.state;

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        {status => (
          <PopmotionAction
            value={value}
            action={action}
            onComplete={this.handleComplete}
          >
            {value => children(status, value)}
          </PopmotionAction>
        )}
      </Transition>
    );
  }
}

export default PopmotionTransition;
