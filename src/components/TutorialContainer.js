import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Tutorial, { Main, NextChapterButton } from './Tutorial';
import NavigationContainer from './NavigationContainer';
import ChapterContainer from './ChapterContainer';
import HeaderContainer from './HeaderContainer';
import { ACTION_READ_ON } from '../constants';
import ConsoleContainer from './ConsoleContainer';

@inject('tutorial')
@observer
class TutorialContainer extends Component {
  handleClickNextChapterButton = () => {
    const { tutorial } = this.props;
    const { currentChapter, nextChapter } = tutorial;

    if (!currentChapter.completed) {
      tutorial.do(ACTION_READ_ON());
    }

    tutorial.navigateToChapter(nextChapter);
  };

  render() {
    const { tutorial } = this.props;
    const { currentChapter, nextChapter } = tutorial;

    return (
      <Tutorial>
        <HeaderContainer />
        <NavigationContainer />
        <Main>
          <ChapterContainer />
        </Main>
        {
          currentChapter && currentChapter.allowsNextChapter && nextChapter &&
          <NextChapterButton onClick={this.handleClickNextChapterButton}>
            {nextChapter.title}
          </NextChapterButton>
        }
        <ConsoleContainer />
      </Tutorial>
    );
  }
}

export default TutorialContainer;
