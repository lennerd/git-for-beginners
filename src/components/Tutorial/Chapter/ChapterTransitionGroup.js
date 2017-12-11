import React, { PureComponent, cloneElement } from 'react';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import { FORWARD, BACK } from './ChapterWrapper';

class ChapterTransitionGroup extends PureComponent {
  get direction() {
    const { chapterId } = this.props.match.params;

    if (this.prevChapterId == null) {
      this.prevChapterId = chapterId;

      return null;
    }

    const direction = chapterId > this.prevChapterId ? FORWARD : BACK;
    this.prevChapterId = chapterId;

    return direction;
  }

  render() {
    const { className, children } = this.props;
    const { direction } = this;

    return (
      <TransitionGroup
        className={className}
        childFactory={child => cloneElement(child, { direction })}
      >
        {children}
      </TransitionGroup>
    );
  }
}

export default styled(ChapterTransitionGroup)`
  height: 100%;
  position: relative;
`;
