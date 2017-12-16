import { observable, computed } from 'mobx';

export const STATUS_ADDED = Symbol('status_added');
export const STATUS_DELETED = Symbol('status_deleted');
export const STATUS_MODIFIED = Symbol('status_modified');

class FileStatus {
  @observable type;
  @observable insertions = 0;
  @observable deletions = 0;

  constructor(type) {
    this.type = type;
  }

  @computed get changes() {
    if (this.type !== STATUS_MODIFIED) {
      return 0;
    }

    return this.insertions + this.deletions;
  }

  clone() {
    const clone = new this.constructor(this.type);
    clone.insertions = this.insertions;
    clone.deletions = this.deletions;

    return clone;
  }
}

export default FileStatus;
