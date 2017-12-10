import Loadable from '../common/Loadable';

export const CHAPTER_TITLES = [
  'Introduction',
  'Versioning of Files',
  'Versioning in Git',
  'Versioning in Git 2',
];

export default [
  Loadable(() => import('./ChapterOne')),
  Loadable(() => import('./ChapterOne')),
  Loadable(() => import('./ChapterOne')),
  Loadable(() => import('./ChapterOne')),
];
