import { createSelector } from 'reselect';

import { selectCurrentChapter } from './progress';

export const selectTrees = state => state.trees;

export const selectCurrentTree = createSelector(
  selectTrees,
  selectCurrentChapter,
  (trees, currentChapter) => {
    if (currentChapter == null || currentChapter.treeIndex == null) {
      return null;
    }

    return trees[currentChapter.treeIndex];
  },
);
