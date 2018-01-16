import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import Button from './Button';

@observer
class ChapterNext extends Component {
  @action.bound turnOver() {
    const { chapter, tutorial } = this.props;

    if (!chapter.completed) {
      return;
    }

    tutorial.currentChapter = tutorial.nextChapter;
  }

  render() {
    const { className, chapter, tutorial } = this.props;

    if (!chapter.completed || !tutorial.nextChapter) {
      return null;
    }

    return (
      <Button className={className} onClick={this.turnOver}>
        {tutorial.nextChapter.id}
      </Button>
    );
  }
}

export default styled(ChapterNext)`
  grid-area: next;
  justify-self: right;
  align-self: center;
  height: ${props => props.theme.spacing(2)};
  position: relative;
  z-index: 1;

  &:after {
    content: '→';
    margin-left: ${props => props.theme.spacing()};
  }
`;
