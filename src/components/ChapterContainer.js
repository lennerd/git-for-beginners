import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Chapter, {
  ChapterTitle,
  ChapterHeader,
  ChapterProgress,
  ChapterBody,
  ChapterText,
  ChapterTextNext
} from './Chapter';
import Title from './Title';
import { selectCurrentSectionIndex } from '../selectors/progress';
import { readOn } from '../reducers/progress';

function ChapterContainer({ chapterIndex, chapters, chapter, currentSectionIndex, onClickReadOn }) {
  // @TODO Move to a selector.
  const sections = chapter.sections
    .filter((section, index) => index <= currentSectionIndex)
    .map((section, index) => (
      <ChapterText key={index}>
        {section.text}
        {
          index === currentSectionIndex && index < (chapter.sections.length - 1) &&
          <ChapterTextNext onClick={onClickReadOn}>Read On</ChapterTextNext>
        }
      </ChapterText>
    ));

  return (
    <Chapter>
      <ChapterHeader>
        <ChapterProgress>
          <Title minor>{chapterIndex + 1} / {chapters.length}</Title>
        </ChapterProgress>
        <ChapterTitle>{chapter.title}</ChapterTitle>
      </ChapterHeader>
      <ChapterBody>
        {sections}
      </ChapterBody>
    </Chapter>
  );
}

export default connect(
  createStructuredSelector({
    currentSectionIndex: selectCurrentSectionIndex,
  }),
  dispatch => bindActionCreators({
    onClickReadOn: readOn,
  }, dispatch),
)(ChapterContainer);
