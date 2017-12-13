import React from 'react';

import Loadable from '../../common/Loadable';
import { fontLoader, SourceCodeProRegular, SourceCodeProBlack } from '../../../fonts';
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
    fontLoader.load(SourceCodeProBlack),
    fetch('https://uinames.com/api/?amount=10&region=united%20states&maxlen=20').then(response => response.json()),
  ])
), ([VersioningInGit, fontRegular, fontBold, randomAuthors]) => new VersioningInGit.default(fontRegular, fontBold, randomAuthors));

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
