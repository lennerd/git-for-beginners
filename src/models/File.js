import { observable, action } from 'mobx';
import { Record } from 'immutable';
import { diffLines } from 'diff';

import chance from './chance';

class File {
  @observable.ref blob;

  constructor(name, content) {
    this.name = name;
    this.blob = new Blob({ content });
  }

  static create(name) {
    if (name == null) {
      name = chance.fileName();

    }

    const numberOfSentences = chance.natural({ min: 1, max: 10 });
    const lines = chance.n(chance.sentence, numberOfSentences);

    return new this(name, lines.join('\n'));
  }

  @action modify() {
    const lines = this.blob.content.split('\n');
    const turns = chance.natural({ min: 1, max: 10});

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

class Blob extends Record({
  content: '',
}) {
  /*merge(source) {
    const patches = dmp.patch_make(this.content, source.content);
    const [content] = dmp.patch_apply(patches, this.content);

    return this.set('content', content);
  }*/

  diff(source) {
    return diffLines(this.content, source.content).reduce((diff, change) => {
      if (change.removed) {
        diff.removed += change.count;
      } else if (change.added) {
        diff.added += change.count;
      }

      return diff;
    }, { added: 0, removed: 0 });
  }
}

export default File;
