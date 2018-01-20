import { observable, action, computed } from 'mobx';
import { Record, Map, Set } from 'immutable';
import sha1 from 'js-sha1';

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
    if (this.stagingArea.tree == null) {
      // No stage tree yet.
      this.stagingArea.tree = new Map();
    }

    if (!this.workingDirectory.tree.has(file)) {
      // File does not exist in the working directory, so also remove it from the staging area.
      this.stagingArea.tree = this.stagingArea.tree.remove(file);

      return;
    }

    this.stagingArea.tree = this.stagingArea.tree.set(file, file.blob);
  }

  @action unstageFile(file) {
    if (this.stagingArea.tree == null) {
      return;
    }

    this.stagingArea.tree = this.stagingArea.tree.remove(file);

    if (this.stagingArea.tree.size === 0) {
      // Remove tree from staging area if no other file exists.
      this.stagingArea.tree = null;
    }
  }

  @action createCommit(message = chance.sentence()) {
    let tree = this.stagingArea.tree;

    if (tree == null) {
      return;
    }

    if (this.head.commit != null) {
      tree = this.head.commit.tree.concat(this.stagingArea.tree);
    }

    const commit = new Commit({
      author: chance.name(),
      message,
      time: Date.now(),
      tree,
      parent: this.head.commit,
    });

    this.commits = this.commits.add(commit);
    this.head.commit = commit;

    this.stagingArea.tree = null;

    return commit;
  }

  @action revertCommit(commit) {
    this.workingDirectory.tree = commit.tree;
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
  @observable.ref tree;
}

class Commit extends Record({
  author: null,
  message: null,
  time: null,
  tree: null,
  parent: null,
}) {
  @computed get checksum() {
    return sha1(JSON.stringify(this.toJS()));
  }

  @computed get checksumShort() {
    return this.checksum.substring(0, 7);
  }
}

class Branch {
  @observable commit;

  constructor(name) {
    this.name = name;
  }
}

export default Repository;
