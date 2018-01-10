import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';

import Tutorial, { Main } from './Tutorial';
import NavigationContainer from './NavigationContainer';
import ChapterContainer from './ChapterContainer';
import HeaderContainer from './HeaderContainer';
import { selectChapters } from '../selectors/chapters';
import { selectCurrentChapterIndex } from '../selectors/progress';

function TutorialContainer({ match, chapters, currentChapterIndex }) {
  const chapterIndex = match.params.chapterId - 1;

  if (chapterIndex >= chapters.length) {
    return <Redirect to="/chapters/1" />;
  }

  if (chapterIndex > currentChapterIndex) {
    return <Redirect to={`/chapters/${currentChapterIndex + 1}`} />;
  }

  const chapter = chapters[chapterIndex];

  return (
    <Tutorial>
      <HeaderContainer chapter={chapter} />
      <NavigationContainer />
      <Main>
        <ChapterContainer
          chapterIndex={chapterIndex}
          chapter={chapter}
          chapters={chapters}
        />
      </Main>
    </Tutorial>
  );
}

export default connect(
  createStructuredSelector({
    chapters: selectChapters,
    currentChapterIndex: selectCurrentChapterIndex,
  }),
)(TutorialContainer);
