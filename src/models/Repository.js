import { observable, action } from 'mobx';
import Chance from 'chance';
import { Record, OrderedMap, OrderedSet } from 'immutable';
import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();
const chance = new Chance();

export const STATUS_UNTRACKED = 0b1;
export const STATUS_TRACKED = 0b10;
export const STATUS_MODIFIED = 0b100;
export const STATUS_STAGED = 0b1000;
export const STATUS_UNMODIFIED = 0b10000;

class Repository {
  workingDirectory = new WorkingDirectory();
  stagingArea = new StagingArea();

  @observable.ref head;
  @observable.ref commits = new OrderedSet();

  @action stageFile(file) {
    const blob = this.workingDirectory.tree.get(file.name);

    if (blob == null) {
      throw new Error('Unknown file.');
    }

    let stagedBlob = this.stagingArea.tree.get(file.name);

    if (stagedBlob != null && blob === stagedBlob) {
      throw new Error('Cannot stage unmodified file.');
    }

    this.stagingArea.tree = this.stagingArea.tree.set(file.name, blob);
  }

  @action createCommit(message = chance.sentence()) {
    const commit = new Commit({
      author: chance.name(),
      message,
      time: Date.now(),
      tree: this.stagingArea.tree,
      parent: this.head,
    });

    this.commits = this.commits.add(commit);
    this.head = commit;

    this.stagingArea.tree = new OrderedMap();

    return commit;
  }

  getFileStatus(file) {
    const stagedBlob = this.stagingArea.tree.get(file.name);

    if (stagedBlob === file.blob) {
      return STATUS_TRACKED | STATUS_STAGED;
    }

    if (this.head != null) {
      const committedBlob = this.head.tree.get(file.name);

      if (committedBlob !== file.blob) {
        return STATUS_TRACKED | STATUS_MODIFIED;
      } else {
        return STATUS_TRACKED | STATUS_UNMODIFIED;
      }
    }

    return STATUS_UNTRACKED;
  }
}

class WorkingDirectory {
  @observable.ref tree = new OrderedMap();

  @action saveFile(file) {
    this.tree = this.tree.set(file.name, file.blob);

    return file;
  }

  @action deleteFile(file) {
    this.tree = this.tree.remove(file.name);

    return file;
  }
}

class StagingArea {
  @observable.ref tree = new OrderedMap();
}

class Commit extends Record({
  author: null,
  message: null,
  time: null,
  tree: null,
  parent: null,
}) {

}

class Blob extends Record({
  content: '',
}) {
  merge(source) {
    const patches = dmp.patch_make(this.content, source.content);
    const content = dmp.patch_apply(patches, this.content)[0];

    return this.set('content', content);
  }
}

export class File {
  @observable.ref blob;

  constructor(name, content) {
    this.name = name;
    this.blob = new Blob({ content });
  }

  static create(name = chance.unique(chance.word, 1, { length: 6 })[0]) {
    const numberOfSentences = chance.natural({ min: 1, max: 10 });
    const lines = chance.n(chance.sentence, numberOfSentences);

    return new this(name, lines.join('\n'));
  }

  @action modify() {
    const lines = this.blob.content.split('\n');
    const turns = chance.natural({ min: 1, max: 3});

    for (let i = 0; i < turns; i++) {
      const index = chance.natural({ min: 0, max: lines.length }) - 1;
      const newOrDelete = chance.natural({ min: 1, max: 3});

      let numberOfDeletedLines = 0;
      let newLines = [];

      if (newOrDelete <= 2) {
        const numberOfNewLines = chance.natural({ min: 1, max: 10 });
        newLines = chance.n(chance.sentence, numberOfNewLines);
      }

      if (newOrDelete >= 2) {
        numberOfDeletedLines = chance.natural({ min: 1, max: 10 });
      }

      lines.splice(index, numberOfDeletedLines, ...newLines);
    }

    this.blob = new Blob({ content: lines.join('\n') });
  }
}

export default Repository;
