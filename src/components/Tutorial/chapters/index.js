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
  import('./Introduction')
));

const VersioningOfFiles = LoadableChapter(() => (
  Promise.all([
    import('./VersioningOfFiles'),
    fontLoader.load(SourceCodeProRegular),
  ])
), ([VersioningOfFiles, font]) => new VersioningOfFiles.default(font));

const VersioningInGit = LoadableChapter(() => (
  Promise.all([
    import('./VersioningInGit'),
    fontLoader.load(SourceCodeProRegular),
    fetch('https://uinames.com/api/?amount=10&region=united%20states&maxlen=10').then(response => response.json()),
  ])
), ([VersioningInGit, font, randomAuthors]) => new VersioningInGit.default(font, randomAuthors));

export default [
  {
    title: 'Introduction',
    component: Introduction,
  },
  {
    title: 'Versioning of Files',
    component: VersioningOfFiles,
  },
  {
    title: 'Versioning in Git',
    component: VersioningInGit,
  },
];
