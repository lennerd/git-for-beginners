import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Chapter, {
  ChapterTitle,
  ChapterHeader,
  ChapterProgress,
  ChapterBody,
  ChapterText,
  ChapterReadOn
} from './Chapter';
import Title from './Title';
import { ACTION_READ_ON } from '../constants';

@inject('tutorial')
@observer
class ChapterContainer extends Component {
  handleClickReadOn = () => {
    const { tutorial } = this.props;

    tutorial.do(ACTION_READ_ON());
  }

  render() {
    const { tutorial } = this.props;
    const { currentChapter, chapters } = tutorial;

    if (currentChapter == null) {
      return null;
    }

    const sections = currentChapter.visibleSections.map((section, index) => (
      <ChapterText key={index}>
        {section.text}
        {
          !currentChapter.allowsNextChapter &&
          index === (currentChapter.visibleSections.length - 1) &&
          <ChapterReadOn onClick={this.handleClickReadOn}>Read On</ChapterReadOn>
        }
      </ChapterText>
    ));

    return (
      <Chapter>
        <ChapterHeader>
          <ChapterProgress>
            <Title minor>{currentChapter.id} / {chapters.length}</Title>
          </ChapterProgress>
          <ChapterTitle>{currentChapter.title}</ChapterTitle>
        </ChapterHeader>
        <ChapterBody>
          {sections}
        </ChapterBody>
      </Chapter>
    );
  }
}

export default ChapterContainer;
