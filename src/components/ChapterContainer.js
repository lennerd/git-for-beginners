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

@inject('tutorial')
@observer
class ChapterContainer extends Component {
  handleReadOnClick = () => {
    const { tutorial } = this.props;

    tutorial.readOn();
  }

  render() {
    const { tutorial } = this.props;
    const { currentChapter, chapters } = tutorial;

    const sections = currentChapter.reachedSections.map((section, index) => (
      <ChapterText key={index}>
        {section.text}
        {
          currentChapter.hasUnreachedSections() &&
          currentChapter.currentSection === section &&
          <ChapterReadOn onClick={this.handleReadOnClick}>Read On</ChapterReadOn>
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
