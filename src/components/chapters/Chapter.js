import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import { TweenLite } from 'gsap';
import styled from 'styled-components';

import Container from '../common/Container';

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

    return (
      <Transition
        {...props}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
      >
        {(status) => (
          <div className={className}>
            <Container>
              {children(status)}
            </Container>
          </div>
        )}
      </Transition>
    );
  }
}

export default styled(Chapter)`
  will-change: transform, opacity;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
