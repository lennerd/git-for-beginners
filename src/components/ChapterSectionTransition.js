import React, { Component } from "react";
import { Transition } from 'react-transition-group';
import { tween } from "popmotion";

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
          <div style={{ opacity }} ref={ref => { this.container = ref }}>{children}</div>
        )}
      </Transition>
    );
  }
}

export default ChapterSectionTransition;
