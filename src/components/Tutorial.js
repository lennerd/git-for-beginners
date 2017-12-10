import React, { Component, cloneElement } from 'react';
import styled from 'styled-components';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { inject, observer } from 'mobx-react';

import Navigation from './nav/Navigation';

const ChapterGroup = styled.div`
  position: relative;
  height: 100%;
`;

@inject('tutorial')
@observer
class Tutorial extends Component {
  constructor(props) {
    super();

    const { tutorial, match } = props;

    tutorial.navigate(parseInt(match.params.id, 10));
  }

  componentWillReceiveProps(nextProps) {
    const { tutorial, match } = nextProps;

    tutorial.navigate(parseInt(match.params.id, 10));
  }

  render() {
    const { className, tutorial } = this.props;
    const { direction, currentChapter } = tutorial;

    return (
      <div className={className}>
        <TransitionGroup
          component={ChapterGroup}
          childFactory={child => cloneElement(child, { direction })}
        >
          {
            currentChapter != null &&
            <currentChapter.component
              key={currentChapter.id}
              chapter={currentChapter}
            />
          }
        </TransitionGroup>
        <Navigation />
      </div>
    );
  }
}

export default styled(Tutorial)`
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to bottom right, #FFF9F7, #B9C0E5);

  ${Navigation} {
    flex-shrink: 0;
  }
`;
