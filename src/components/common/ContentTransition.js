import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';
import { TweenLite } from 'gsap';

export const FORWARD = Symbol('forward');
export const BACK = Symbol('back');

class ContentTransition extends PureComponent {
  handleEnter = (node) => {
    const { direction } = this.props;
    const origin = {
      opacity: 0,
    };

    if (direction != null) {
      origin.x = direction === BACK ? '-50%' : '50%';
    }

    this.tween = TweenLite.from(node, 1, origin);
  };

  handleExit = (node) => {
    const { direction } = this.props;
    const target = {
      opacity: 0,
    };

    if (direction != null) {
      target.x = direction === BACK ? '50%' : '-50%';
    }

    this.tween = TweenLite.to(node, 1, target);
  };

  addEndListener = (node, done) => {
    this.tween.eventCallback('onComplete', done);
  }

  render() {
    const { ...props } = this.props;

    delete props.direction;

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
