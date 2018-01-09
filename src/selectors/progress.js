import { createSelector } from 'reselect';

import { selectChapters } from './chapters';

export const selectCurrentChapterIndex = state => state.progress.chapterIndex;
export const selectCurrentSectionIndex = state => state.progress.sectionIndex;

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
    if (chapters.length < 2) {
      return 0;
    }

    const chapterStep = 1 / (chapters.length - 1);
    const sectionStep = chapterStep * (1 / (currentChapter.sections.length - 1));

    return chapterStep * chapterIndex + sectionStep * sectionIndex;
  },
);

export const selectPreviousChapter = createSelector(
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
);
