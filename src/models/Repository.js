import { observable, action, computed } from 'mobx';
import { Record, Map, OrderedSet } from 'immutable';
import sha1 from 'js-sha1';

import chance from './chance';
import ConsoleError from './ConsoleError';

class Repository {
  workingDirectory = new WorkingDirectory();
  stagingArea = new StagingArea();

  @observable.ref commits = new OrderedSet();
  @observable head;
  @observable branches = [];

  constructor() {
    const master = new Branch('master');

    this.head = master;
    this.branches = [master];
  }

  @action
  createBranch(branchName) {
    let branch = this.branches.find(branch => branch.name === branchName);

    if (branch != null) {
      throw new ConsoleError('Branch already exists.');
    }

    if (this.head.commit == null) {
      throw new ConsoleError('No commits yet.');
    }

    branch = new Branch(branchName);
    branch.commit = this.head.commit;
    this.branches.push(branch);

    return branch;
  }

  @action
  checkout(branchName) {
    const branch = this.branches.find(branch => branch.name === branchName);

    if (branch == null) {
      throw new ConsoleError('Unknown branch.');
    }

    return (this.head = branch);
  }

  @action
  merge(branchName, message = chance.sentence()) {
    const branch = this.branches.find(branch => branch.name === branchName);

    if (branch == null) {
      throw new ConsoleError('Unknown branch.');
    }

    const parents = [this.head.commit, branch.commit];
    const tree = this.head.commit.tree.mergeWith((headBlob, branchBlob) => {
      return headBlob.mergeContent(branchBlob);
    }, branch.commit.tree);

    const commit = new Commit({
      author: chance.name(),
      message,
      tree,
      parents,
    });

    this.commits = this.commits.add(commit);
    this.head.commit = commit;

    return this.head;
  }

  @action
  stageFile(file) {
    const blob = this.workingDirectory.tree.get(file);
    const stagedBlob = this.stagingArea.tree.get(file);

    if (blob == null) {
      // File does not exist in the working directory, so also remove it from the staging area.
      this.stagingArea.tree = this.stagingArea.tree.remove(file);
    } else {
      if (blob === stagedBlob) {
        throw new ConsoleError('Cannot stage unmodified file.');
      }

      this.stagingArea.tree = this.stagingArea.tree.set(file, blob);
    }
  }

  @action
  unstageFile(file) {
    const blob = this.stagingArea.tree.get(file);
    let committedBlob;

    if (this.head.commit != null) {
      committedBlob = this.head.commit.tree.get(file);
    }

    // Restore staging area blob from last commit, if available.
    if (committedBlob == null) {
      this.stagingArea.tree = this.stagingArea.tree.remove(file);
    } else {
      this.stagingArea.tree = this.stagingArea.tree.set(file, committedBlob);
    }

    /*if (blob == null) {
      // File is not part of the staging area. So possible it was deleted. Restore it from the last commit.
      const committedBlob = this.head.commit.tree.get(file);

      if (committedBlob == null) {
        throw new Error('No blob to restore.');
      }

      blob = committedBlob;
    }*/

    this.workingDirectory.tree = this.workingDirectory.tree.set(file, blob);
  }

  @action
  createCommit(message) {
    const parents = [];

    if (this.head.commit != null) {
      if (message != null && this.head.commit.tree === this.stagingArea.tree) {
        throw new ConsoleError('No new changes to add to a commit.');
      }

      parents.push(this.head.commit);
    }

    if (message == null) {
      message = chance.sentence();
    }

    const commit = new Commit({
      author: chance.name(),
      message,
      tree: this.stagingArea.tree,
      parents,
    });

    this.commits = this.commits.add(commit);
    this.head.commit = commit;

    return commit;
  }

  @action
  revertCommit(commit) {
    this.workingDirectory.tree = commit.tree;
  }
}

class WorkingDirectory {
  @observable.ref tree = new Map();

  @action
  addFile(file) {
    this.tree = this.tree.set(file, file.blob);
  }

  @action
  removeFile(file) {
    this.tree = this.tree.remove(file);
  }
}

class StagingArea {
  @observable.ref tree = new Map();
}

class Commit extends Record({
  author: null,
  message: null,
  tree: null,
  parents: [],
}) {
  @computed
  get checksum() {
    return sha1(JSON.stringify(this.toJS()));
  }

  @computed
  get checksumShort() {
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
