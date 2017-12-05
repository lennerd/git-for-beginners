import { observable, computed } from 'mobx';

export const STATUS_ADDED = Symbol('status_added');
export const STATUS_DELETED = Symbol('status_deleted');
export const STATUS_MODIFIED = Symbol('status_modified');

class FileStatus {
  @observable insertions = 0;
  @observable deletions = 0;

  constructor(file, type) {
    this.file = file;
    this.type = type;
  }

  @computed get changes() {
    return this.insertions + this.deletions;
  }
}

export default FileStatus;
