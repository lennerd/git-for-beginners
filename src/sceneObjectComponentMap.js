import CommitModel from './models/Commit';
import FileModel from './models/File';
import SceneModel from './models/Scene';

import CommitComponent from './components/Commit';
import FileComponent from './components/File';
import SceneComponent from './components/Scene';

export default new Map([
  [CommitModel, CommitComponent],
  [FileModel, FileComponent],
  [SceneModel, SceneComponent],
]);
