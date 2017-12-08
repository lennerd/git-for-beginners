import React, { PureComponent, cloneElement } from 'react';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';

import Chapter, { FORWARD, BACK } from './chapters/Chapter';
import LoadingSpinner from './LoadingSpinner';

const ChapterOne = Loadable({
  loader: () => import('./chapters/ChapterOne'),
  loading: LoadingSpinner,
});

const CHAPTERS = [
  ChapterOne,
  ChapterOne,
  ChapterOne,
];

const ChapterGroup = styled.div`
  position: relative;
  height: 100%;

  ${Chapter} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

class Tutorial extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { chapter } = this.props.match.params;

    this.direction = chapter < nextProps.match.params.chapter ? FORWARD : BACK;
  }

  render() {
    const { className, match } = this.props;
    const { chapter } = match.params;

    const Chapter = CHAPTERS[chapter];

    return (
      <div className={className}>
        <TransitionGroup
          component={ChapterGroup}
          childFactory={child => cloneElement(child, { direction: this.direction })}
        >
          {Chapter != null && <Chapter key={chapter} />}
        </TransitionGroup>
      </div>
    );
  }
}

export default styled(Tutorial)`
  position: relative;
  height: 100%;
  overflow: hidden;
`;
