import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Tutorial, { Main, NextChapterButton } from './Tutorial';
import NavigationContainer from './NavigationContainer';
import ChapterContainer from './ChapterContainer';
import HeaderContainer from './HeaderContainer';

@inject('tutorial')
@observer
class TutorialContainer extends Component {
  handleNextChapterButtonClick = () => {
    const { tutorial } = this.props;

    tutorial.readOn();
  }

  render() {
    const { tutorial } = this.props;
    const { currentChapter } = tutorial;

    const nextChapter = tutorial.getNextChapter(currentChapter);

    return (
      <Tutorial>
        <HeaderContainer />
        <NavigationContainer />
        <Main>
          <ChapterContainer />
        </Main>
        {
          !currentChapter.hasUnreachedSections() && nextChapter &&
          <NextChapterButton onClick={() => {
            if (!currentChapter.completed) {
              tutorial.readOn();
            }

            tutorial.activateChapter(nextChapter);
          }}>
            {nextChapter.title}
          </NextChapterButton>
        }
      </Tutorial>
    );
  }
}

export default TutorialContainer;
