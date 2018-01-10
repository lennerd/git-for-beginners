import { createSelector } from 'reselect';

import { selectChapters } from './chapters';

function map(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export const selectProgress = state => state.progress;
export const selectCurrentChapterIndex = state => selectProgress(state).chapterIndex;
export const selectCurrentSectionIndex = state => selectProgress(state).sectionIndex;

export const selectCurrentChapter = createSelector(
  selectChapters,
  selectCurrentChapterIndex,
  (chapters, chapterIndex) => chapters[chapterIndex],
);

export const selectTutorialProgress = createSelector(
  selectChapters,
  selectCurrentChapter,
  selectCurrentChapterIndex,
  selectCurrentSectionIndex,
  (chapters, currentChapter, chapterIndex, sectionIndex) => {
    const chapterStep = chapters.length > 1 ? 1 / (chapters.length - 1) : 1;

    return map(chapterIndex, 0, chapters.length - 1, 0, 1) +
      map(sectionIndex, 0, currentChapter.sections.length, 0, chapterStep);
  },
);

/*export const selectPreviousChapter = createSelector(
  selectChapters,
  selectCurrentChapterIndex,
  (chapters, chapterIndex) => (
    chapters[chapterIndex - 1]
  ),
);

export const selectNextChapter = createSelector(
  selectChapters,
  selectCurrentChapterIndex,
  (chapters, chapterIndex) => (
    chapters[chapterIndex + 1]
  ),
);

export const selectCurrentSection = createSelector(
  selectCurrentChapter,
  selectCurrentSectionIndex,
  (currentChapters, sectionIndex) => (
    currentChapters.sections[sectionIndex]
  ),
);

export const isLastSection = createSelector(
  selectCurrentChapter,
  selectCurrentSectionIndex,
  (currentChapters, sectionIndex) => (
    sectionIndex === (currentChapters.sections.length - 1)
  ),
);*/
