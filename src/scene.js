import { runInAction } from 'mobx';

import Scene from './models/Scene';
//import Commit from './models/Commit';
import Version from './models/Version';
import File from './models/File';
import { STATUS_MODIFIED, STATUS_DELETED, STATUS_ADDED } from './models/FileStatus';

/*const files = Array.apply(null, Array(7)).map((file, index) => {
  file = new File();

  const status = Math.floor(Math.random() * 3 % 3);

  if (status === 0) {
    file.status.type = STATUS_MODIFIED;
    file.status.insertions = Math.round(Math.random() * 10);
    file.status.deletions = Math.round(Math.random() * 10);
  } else if (status === 1) {
    file.status.type = STATUS_DELETED;
  } else if (status === 2) {
    file.status.type = STATUS_ADDED;
  }

  return file;
});

const commit1 = new Commit([
  files[0],
  files[1],
  files[2],
  files[3],
]);

const commit2 = new Commit([
  files[4],
  files[5],
  files[6],
]);

const scene = new Scene([
  commit1,
  commit2,
]);

setTimeout(() => {
  commit2.add(files[1]);
}, 2000);

setTimeout(() => {
  commit2.add(files[3]);
}, 4000);

setTimeout(() => {
  commit1.add(files[5]);
}, 6000);*/


const scene = new Scene();

class Timeline {
  constructor() {
    this._timeline = [];
    this._currentIndex = 0;
    this._loop = false;
    this._playing = false;
  }

  add(step) {
    this._timeline.push(step);

    return this;
  }

  loop(loop = true) {
    this._loop = loop;

    return this;
  }

  reset() {
    this._currentIndex = 0;

    return this;
  }

  next(context) {
    const currentIndex = this._currentIndex++;

    if (currentIndex >= this._timeline.length) {
      if (this._loop) {
        this.reset();
        this.next(context);
      } else {
        this.stop();

        if (this.onComplete) {
          this.onComplete();
        }
      }

      return;
    }

    if (!this._playing) {
      return;
    }

    const current = this._timeline[currentIndex];

    if (typeof current === 'number') {
      this._timeoutRef = setTimeout(
        () => this.next(context),
        current * 1000,
      );
    } else if(current instanceof this.constructor) {
      current.onComplete = () => this.next(context);
      current.start(context);
    } else {
      current.call(context);
      this.next(context);
    }

    return this;
  }

  start(context) {
    this._playing = true;

    return this.next(context);
  }

  stop() {
    this.reset();

    clearTimeout(this._timeoutRef);
    this._playing = false;

    return this;
  }
}

const chapter = new Timeline();

function init() {
  const version = new Version();

  const file = new File();
  version.add(file);
  this.file = file;

  this.scene.addFront(version);
}

function newVersion() {
  const version = new Version();
  this.version = version;

  runInAction(() => {
    this.scene.limit(10);
    this.scene.addFront(version);
  });
}

function copyFile() {
  this.file = this.file.copy();

  this.version.add(this.file);
}

const innerChapter = new Timeline()
  .add(newVersion)
  .add(2)
  .add(copyFile)
  .add(2)
  .loop();

chapter
  .add(6)
  .add(init)
  .add(2)
  .add(innerChapter)
  .start({ scene });

export default scene;
