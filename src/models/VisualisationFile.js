import { observable, computed, action } from 'mobx';

import { STATUS_ADDED, STATUS_MODIFIED, STATUS_DELETED } from '../constants';

import VisualisationObject from './VisualisationObject';

class VisualisationFile extends VisualisationObject {
  isFile = true;

  @observable insertions = 0;
  @observable deletions = 0;
  @observable status = STATUS_ADDED;
  @observable name;

  @computed get diff() {
    return { added: this.insertions, removed: this.deletions };
  }

  @computed get modified() {
    return this.insertions > 0 || this.deletions > 0;
  }

  @computed get changes() {
    return this.insertions + this.deletions;
  }

  @computed get insideArea() {
    let parent = this.parent;

    while (parent != null) {
      if (parent.isArea) {
        return true;
      }

      parent = parent.parent;
    }


    return false;
  }

  @action modify() {
    const { insertions, deletions } = createModifications();

    this.insertions += insertions;
    this.deletions += deletions;
  }

  getPosition() {
    const position = super.getPosition();

    if (this.parent != null && this.parent.isFileList) {
      position.level += this.parent.files.indexOf(this);
    }

    return position;
  }

  @action copy(recursive = true) {
    const file = super.copy(recursive);

    file.insertions = this.insertions;
    file.deletions = this.deletions;
    file.status = this.status;
    file.name = this.name;
    file.copyPosition = this.position;

    return file;
  }

  @action reset(file) {
    if (file == null) {
      this.insertions = 0;
      this.deletions = 0;
      this.status = STATUS_MODIFIED;
    } else {
      this.insertions = file.insertions;
      this.deletions = file.deletions;
      this.status = file.status;
    }

    return this;
  }

  @action merge(file) {
    this.insertions += file.insertions;
    this.deletions += file.deletions;
    this.status = file.status;

    return this;
  }

  @action revert(file = this) {
    this.insertions += file.deletions;
    this.deletions += file.insertions;

    if (file.status === STATUS_DELETED) {
      this.status = STATUS_ADDED;
    } else if (file.status === STATUS_ADDED) {
      this.status = STATUS_DELETED;
    }

    return this;
  }
}

export function createModifications() {
  const modifications = { insertions: 0, deletions: 0, };
  const change = Math.round(Math.random() * 2);

  if (change === 0 || change === 1) {
    modifications.insertions += 1 + Math.round(Math.random() * 19);
  }

  if (change === 0 || change === 2) {
    modifications.deletions += 1 + Math.round(Math.random() * 19);
  }

  return modifications;
}

export default VisualisationFile;
