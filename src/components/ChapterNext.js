import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import Button from './Button';
import arrowRightLarge from '../images/arrowRightLarge.svg';

@observer
class ChapterNext extends Component {
  @action.bound turnOver() {
    const { chapter, tutorial } = this.props;

    if (!chapter.completed) {
      return;
    }

    chapter.progress = 1;
    tutorial.turnOver();
  }

  render() {
    const { className, chapter, tutorial } = this.props;

    if (!chapter.completed || !tutorial.nextChapter) {
      return null;
    }

    return (
      <Button className={className} onClick={this.turnOver}>
        {tutorial.nextChapter.title}
      </Button>
    );
  }
}

export default styled(ChapterNext)`
  grid-area: next;
  justify-self: right;
  align-self: center;
  //background-image: url(${arrowRightLarge});
  //background-position: 100% 0;
  //padding-right: ${props => props.theme.spacing(1.5)};
  height: ${props => props.theme.spacing(2)};
  position: relative;
  z-index: 1;

  &:after {
    content: '→';
    margin-left: ${props => props.theme.spacing()};
  }
`;
