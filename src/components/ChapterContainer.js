import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';

import { selectChapters } from '../selectors/chapters';
import { selectCurrentChapterIndex } from '../selectors/progress';
import Chapter, { ChapterTitle, ChapterHeader, ChapterProgress } from './Chapter';
import Title from './Title';

function ChapterContainer({ match, chapters, currentChapterIndex }) {
  const chapterIndex = match.params.chapterId - 1;

  if (chapterIndex >= chapters.length) {
    return <Redirect to="/chapters/1" />;
  }

  if (chapterIndex > currentChapterIndex) {
    return <Redirect to={`/chapters/${currentChapterIndex + 1}`} />;
  }

  const chapter = chapters[chapterIndex];

  return (
    <Chapter>
      <ChapterHeader>
        <ChapterProgress><Title minor>{chapterIndex + 1} / {chapters.length}</Title></ChapterProgress>
        <ChapterTitle>{chapter.title}</ChapterTitle>
      </ChapterHeader>
    </Chapter>
  );
}

export default connect(
  createStructuredSelector({
    chapters: selectChapters,
    currentChapterIndex: selectCurrentChapterIndex,
  }),
)(ChapterContainer);
