import React from 'react';
import Loadable from '../common/Loadable';
import { fontLoader, SourceCodeProRegular } from '../../fonts';

export const CHAPTER_TITLES = [
  'Introduction',
  'Versioning of Files',
  'Versioning in Git',
  'Versioning in Git 2',
];

const ChapterOne = Loadable.Map({
  ChapterOne: () => import('./ChapterOne').then(ChapterOne => ChapterOne.default),
  font: () => fontLoader.load(SourceCodeProRegular),
}, {
  render(loaded, props) {
    const { ChapterOne, font } = loaded;

    return (
      <ChapterOne {...props} font={font} />
    );
  }
});

export default [
  ChapterOne,
  ChapterOne,
  ChapterOne,
  ChapterOne,
];
