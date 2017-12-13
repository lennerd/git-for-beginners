import { action } from 'mobx';

import FileStatus, { STATUS_ADDED, STATUS_MODIFIED } from './FileStatus';
import Model from './Model';

class File extends Model {
  constructor(name) {
    super();

    this.name = name;
    this.status = new FileStatus(STATUS_ADDED);
  }

  clone() {
    const clone = new this.constructor(this.name);

    if (this.parent != null) {
      this.parent.add(clone);
    }

    clone.status = this.status.clone();

    return clone;
  }

  @action reset() {
    this.status.insertions = 0;
    this.status.deletions = 0;
  }

  @action modify() {
    this.status.type = STATUS_MODIFIED;
    this.status.insertions = Math.round(Math.random() * 20);
    this.status.deletions = Math.round(Math.random() * 20);
  }
}

export default File;
