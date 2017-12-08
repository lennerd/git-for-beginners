import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import { TweenLite } from 'gsap';
import styled from 'styled-components';

import Visualisation from '../Visualisation';
import ChapterText from './ChapterText';

export const FORWARD = Symbol('forward');
export const BACK = Symbol('back');

class Chapter extends Component {
  handleEnter = (node) => {
    const { direction } = this.props;

    this.tween = TweenLite.from(node, 1, {
      x: direction === BACK ? '-100vw' : '100vw',
      opacity: 0,
    });
  };

  handleExit = (node) => {
    const { direction } = this.props;

    this.tween = TweenLite.to(node, 1, {
      x: direction === BACK ? '100vw' : '-100vw',
      opacity: 0,
    });
  };

  addEndListener = (node, done) => {
    this.tween.eventCallback('onComplete', done);
  }

  render() {
    const { children, className, ...props } = this.props;

    delete props.direction;

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        <div className={className}>
          {children}
        </div>
      </Transition>
    );
  }
}

export default styled(Chapter)`
  will-change: transform, opacity;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${Visualisation} {
    z-index: 0;
  }

  ${ChapterText} {
    position: relative;
    z-index: 1;
  }
`;
