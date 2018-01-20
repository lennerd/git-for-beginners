import { observable, action } from 'mobx';
import { Record, Map, Set } from 'immutable';

import chance from './chance';

class Repository {
  workingDirectory = new WorkingDirectory();
  stagingArea = new StagingArea();

  @observable.ref commits = new Set();
  @observable head;
  @observable branches = [];

  constructor() {
    const master = new Branch('master');

    this.head = master;
    this.branches = [master];
  }

  @action stageFile(file) {
    let stagedBlob = this.stagingArea.tree.get(file);

    if (stagedBlob != null && file.blob === stagedBlob) {
      throw new Error('Cannot stage unmodified file.');
    }

    this.stagingArea.tree = this.stagingArea.tree.set(file, file.blob);
  }

  @action unstageFile(file) {
    this.stagingArea.tree = this.stagingArea.tree.remove(file);
  }

  @action createCommit(message = chance.sentence()) {
    const commit = new Commit({
      author: chance.name(),
      message,
      time: Date.now(),
      tree: this.stagingArea.tree,
      parent: this.head.commit,
    });

    this.commits = this.commits.add(commit);
    this.head.commit = commit;

    this.stagingArea.tree = this.stagingArea.tree.clear();

    return commit;
  }

  getFileStatus(file) {
    /*let status = 0;

    if (!this.stagingArea.tree.has(file)) {
      status = status | STATUS_UNTRACKED
    } else {
      status = status | STATUS_TRACKED;
    }

    if (this.head.commit != null) {
      const committedBlob = this.head.commit.tree.get(file);

      if (committedBlob === file.blob) {
        status = status | STATUS_UNMODIFIED;
      } else {
        status = status | STATUS_MODIFIED;
      }
    }

    const stagedBlob = this.stagingArea.tree.get(file);

    if (stagedBlob != null && stagedBlob === file.blob) {
      return STATUS_TRACKED | STATUS_STAGED;
    }

    if (this.head.commit != null) {
      const committedBlob = this.head.commit.tree.get(file);

      if (committedBlob === file.blob) {
        return STATUS_TRACKED | STATUS_UNMODIFIED;
      } else {
        return STATUS_TRACKED | STATUS_MODIFIED;
      }
    }

    return STATUS_TRACKED | STATUS_MODIFIED;*/

    return 0;
  }
}

class WorkingDirectory {
  @observable.ref tree = new Map();

  @action addFile(file) {
    this.tree = this.tree.set(file, file.blob);
  }

  @action removeFile(file) {
    this.tree = this.tree.remove(file);
  }
}

class StagingArea {
  @observable.ref tree = new Map();
}

class Commit extends Record({
  author: null,
  message: null,
  time: null,
  tree: null,
  parent: null,
}) {

}

class Branch {
  @observable commit;

  constructor(name) {
    this.name = name;
  }
}

export default Repository;
