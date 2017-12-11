import React from 'react';

import Loadable from '../common/Loadable';
import { fontLoader, SourceCodeProRegular } from '../../fonts';

const ChapterOne = Loadable.Map({
  ChapterOne: () => import(/* webpackChunkName: "chapter-one" */ './ChapterOne').then(ChapterOne => ChapterOne.default),
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
  {
    id: 1,
    title: 'Introduction',
    component: ChapterOne,
  },
  {
    id: 2,
    title: 'Versioning of Files',
    component: ChapterOne,
  },
  {
    id: 3,
    title: 'Version Database',
    component: ChapterOne,
  },
  {
    id: 4,
    title: 'Versioning in Git',
    component: ChapterOne,
  },
];
