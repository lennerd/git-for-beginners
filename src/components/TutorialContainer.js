import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Tutorial, { TutorialReset } from './Tutorial';
import TutorialNavigation from './TutorialNavigation';
import TutorialHeader from './TutorialHeader';
import IntroductionChapter from './IntroductionChapter';
import VersioningOfFilesChapter from './VersioningOfFilesChapter';
import VersioningInGitChapter from './VersioningInGitChapter';
import FontLoader from './FontLoader';
import {
  CHAPTER_INTRODUCTION,
  CHAPTER_VERSIONING_OF_FILES,
  CHAPTER_VERSIONING_IN_GIT,
  CHAPTER_GIT
} from '../constants';
import GitChapter from './GitChapter';

const CHAPTER_COMPONENTS = {
  [CHAPTER_INTRODUCTION]: IntroductionChapter,
  [CHAPTER_VERSIONING_OF_FILES]: VersioningOfFilesChapter,
  [CHAPTER_GIT]: GitChapter,
  [CHAPTER_VERSIONING_IN_GIT]: VersioningInGitChapter,
};

@inject('tutorial')
@observer
class TutorialContainer extends Component {
  render() {
    const { tutorial } = this.props;

    let ChapterComponent = CHAPTER_COMPONENTS[tutorial.currentChapter.title];

    return (
      <Tutorial>
        <TutorialHeader tutorial={tutorial} />
        <TutorialNavigation tutorial={tutorial} />
        <FontLoader>
          {(fonts) => (
            ChapterComponent &&
            <ChapterComponent
              {...fonts}
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
