import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';
import { TweenLite } from 'gsap';

export const FORWARD = Symbol('forward');
export const BACK = Symbol('back');

class ContentTransition extends PureComponent {
  static defaultProps = {
    duration: 1,
  };

  handleEnter = (node) => {
    const { direction, duration } = this.props;

    const origin = {
      opacity: 0,
    };

    if (direction != null) {
      origin.x = direction === BACK ? '-50%' : '50%';
    }

    this.tween = TweenLite.from(node, duration, origin);
  };

  handleExit = (node) => {
    const { direction, duration } = this.props;

    const target = {
      opacity: 0,
    };

    if (direction != null) {
      target.x = direction === BACK ? '50%' : '-50%';
    }

    this.tween = TweenLite.to(node, duration, target);
  };

  addEndListener = (node, done) => {
    this.tween.eventCallback('onComplete', done);
  }

  render() {
    const { ...props } = this.props;

    delete props.direction;
    delete props.duration;

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      />
    );
  }
}

export default ContentTransition;
