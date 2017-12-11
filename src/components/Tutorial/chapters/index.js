import React from 'react';

import Loadable from '../../common/Loadable';
import { fontLoader, SourceCodeProRegular } from '../../../fonts';
import Chapter from '../Chapter';

function LoadableChapter(loader, storyInitialiser) {
  return Loadable({
    loader,
    render(loaded, props) {
      return <Chapter storyInitialiser={storyInitialiser} loaded={loaded} {...props} />;
    },
  });
}

const Introduction = LoadableChapter(() => (
  Promise.all([
    import(/* webpackChunkName: "introduction" */'./Introduction'),
    fontLoader.load(SourceCodeProRegular),
  ])
), ([Introduction, font]) => new Introduction.default(font));

const VersioningOfFiles = LoadableChapter(() => (
  Promise.all([
    import(/* webpackChunkName: "versioningOfFiles" */'./VersioningOfFiles'),
    fontLoader.load(SourceCodeProRegular),
  ])
), ([VersioningOfFiles, font]) => new VersioningOfFiles.default(font));

export default [
  {
    id: 1,
    title: 'Introduction',
    component: Introduction,
  },
  {
    id: 2,
    title: 'Versioning of Files',
    component: VersioningOfFiles,
  },
  {
    id: 3,
    title: 'Version Database',
    component: Introduction,
  },
  {
    id: 4,
    title: 'Versioning in Git',
    component: Introduction,
  },
];
