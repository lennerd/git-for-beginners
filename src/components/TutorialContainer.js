import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Tutorial, { TutorialReset } from './Tutorial';
import TutorialNavigation from './TutorialNavigation';
import TutorialHeader from './TutorialHeader';
import IntroductionChapter from './IntroductionChapter';
import VersioningOfFilesChapter from './VersioningOfFilesChapter';
import FontLoader from './FontLoader';

const CHAPTER_COMPONENTS = [
  IntroductionChapter,
  VersioningOfFilesChapter,
];

@inject('tutorial')
@observer
class TutorialContainer extends Component {
  render() {
    const { tutorial } = this.props;

    const chapterComponentIndex = CHAPTER_COMPONENTS.findIndex(Component => (
      tutorial.currentChapter.is(Component.chapter)
    ));

    let ChapterComponent = CHAPTER_COMPONENTS[chapterComponentIndex];

    return (
      <Tutorial>
        <TutorialHeader tutorial={tutorial} />
        <TutorialNavigation tutorial={tutorial} />
        <FontLoader>
          {(fonts) => (
            ChapterComponent &&
            <ChapterComponent
              {...fonts}
              index={chapterComponentIndex}
              chapter={tutorial.currentChapter}
              tutorial={tutorial}
            />
          )}
        </FontLoader>
        <TutorialReset onClick={tutorial.reset}>Reset</TutorialReset>
      </Tutorial>
    );
  }
}

export default TutorialContainer;
