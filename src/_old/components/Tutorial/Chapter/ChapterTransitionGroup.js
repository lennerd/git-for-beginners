import React, { PureComponent, cloneElement } from 'react';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import { FORWARD, BACK } from '../../common/ContentTransition';

class ChapterTransitionGroup extends PureComponent {
  get direction() {
    const { chapterIndex } = this.props.match.params;

    if (this.prevChapterIndex == null || chapterIndex === this.prevChapterIndex) {
      this.prevChapterIndex = chapterIndex;

      return null;
    }

    const direction = chapterIndex > this.prevChapterIndex ? FORWARD : BACK;
    this.prevChapterIndex = chapterIndex;

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
