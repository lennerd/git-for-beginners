import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';

import Root from './components/Root';
import './injectGlobal';
import Repository, { File, STATUS_UNTRACKED, STATUS_TRACKED, STATUS_STAGED, STATUS_UNMODIFIED, STATUS_MODIFIED } from './models/Repository';

useStrict(true);

render(
  <Root />,
  document.getElementById('root'),
);

const repo = new Repository()

const firstFile = File.create();

console.log('untracked', repo.getFileStatus(firstFile) & STATUS_UNTRACKED);

repo.workingDirectory.saveFile(firstFile);
repo.stageFile(firstFile);

console.log('tracked', repo.getFileStatus(firstFile) & STATUS_TRACKED);
console.log('staged', repo.getFileStatus(firstFile) & STATUS_STAGED);

repo.createCommit();

console.log('unmodified', repo.getFileStatus(firstFile) & STATUS_UNMODIFIED);

firstFile.modify();

console.log('modified', repo.getFileStatus(firstFile) & STATUS_MODIFIED);
