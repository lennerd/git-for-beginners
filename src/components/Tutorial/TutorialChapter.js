import React, { PureComponent } from 'react';
import { inject } from 'mobx-react';

import TutorialWrapper from './TutorialWrapper';
import ChapterTransitionGroup from './Chapter/ChapterTransitionGroup';
import Navigation from './Navigation';

@inject('tutorial')
class TutorialChapter extends PureComponent {
  render() {
    const { tutorial, match } = this.props;

    const chapterId = parseInt(match.params.chapterId, 10);
    const chapter = tutorial.findChapter(chapterId);

    if (chapter == null) {
      console.error('Unknown chapter.');

      return null;
    }

    return (
      <TutorialWrapper>
        <Navigation chapter={chapter} />
        <ChapterTransitionGroup match={match}>
          <chapter.component key={match.params.chapterId} chapter={chapter} />
        </ChapterTransitionGroup>
      </TutorialWrapper>
    );
  }
}

export default TutorialChapter;
