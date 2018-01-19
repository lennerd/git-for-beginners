import React, { Component } from "react";
import { Transition } from 'react-transition-group';
import { value, tween } from "popmotion";
import { MotionValue } from 'popmotion-react';

/*function ChapterSectionTransition({ children, ...props }) {
  const hidden = { opacity: 0 };
  const visible = { opacity: 1 };

  const actions = {
    enter: tween({ from: hidden, to: visible, duration: 700, }),
    exit: tween({ from: visible, to: hidden, duration: 700, }),
  };

  return (
    <Transition {...props} actions={actions}>
      {(status, { opacity }) => (
        <div style={{ opacity }}>
          {children}
        </div>
      )}
    </Transition>
  );
}*/

class ChapterSectionTransition extends Component {
  state = {
    opacity: 1,
  };

  handleEnter = () => {
    this.tween = tween({ from: 0, to: 1, duration: 700 });
  };

  handleExit = () => {
    this.tween = tween({ from: 1, to: 0, duration: 700 });
  };

  addEndListener = (node, complete) => {
    const update = opacity => {
      this.setState({ opacity });
    };

    this.tween.start({
      update,
      complete,
    });
  };

  render() {
    const { children, ...props } = this.props;
    const { opacity } = this.state;

    return (
      <Transition {...props} onEnter={this.handleEnter} onExit={this.handleExit} addEndListener={this.addEndListener}>
        {() => (
          <div style={{ opacity }}>{children}</div>
        )}
      </Transition>
    );
  }
}

export default ChapterSectionTransition;
