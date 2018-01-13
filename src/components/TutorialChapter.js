/*import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Chapter, {
  ChapterTitle,
  ChapterHeader,
  ChapterProgress,
  ChapterBody,
} from './Chapter';
import Title from './Title';
import { ACTION_READ_ON } from '../constants';
import ChapterSectionContainer from './ChapterSectionContainer';

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
      <ChapterSectionContainer
        key={section.id}
        section={section}
        onClickReadOn={this.handleClickReadOn}
      />
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

export default ChapterContainer;*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class TutorialChapter extends Component {
  render() {
    const { tutorial } = this.props;

    if (!tutorial.currentChapter.is(CHAPTER_INTRODUCTION)) {
      return null;
    }

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader>
            <ChapterProgress>
              <Title minor>{currentChapter.id} / {chapters.length}</Title>
            </ChapterProgress>
            <ChapterTitle>{currentChapter.title}</ChapterTitle>
          </ChapterHeader>
        </ChapterMain>
        {
          tutorial.nextChapter &&
          <ChapterNext onClick={tutorial.turnOver}>
            {tutorial.nextChapter.title}
          </ChapterNext>
        }
      </Chapter>
    );
  }
}

export default TutorialChapter;
