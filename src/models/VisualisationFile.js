import { observable, computed, action } from 'mobx';

import { STATUS_ADDED } from '../constants';

import VisualisationObject from './VisualisationObject';

class VisualisationFile extends VisualisationObject {
  isFile = true;

  @observable insertions = 0;
  @observable deletions = 0;
  @observable status = STATUS_ADDED;
  @observable name;

  @computed get modified() {
    return this.insertions > 0 || this.deletions > 0;
  }

  @computed get changes() {
    return this.insertions + this.deletions;
  }

  @action modify() {
    const change = Math.round(Math.random() * 2);

    if (change === 0 || change === 1) {
      this.insertions += 1 + Math.round(Math.random() * 19);
    }

    if (change === 0 || change === 2) {
      this.deletions += 1 + Math.round(Math.random() * 19);
    }
  }

  getPosition() {
    const position = super.getPosition();

    if (this.parent != null && this.parent.isFileList) {
      position.level += this.parent.children.indexOf(this);
    }

    return position;
  }

  copy(recursive = true) {
    const file = super.copy(recursive);

    file.insertions = this.insertions;
    file.deletions = this.deletions;
    file.status = this.status;

    return file;
  }

  @action reset() {
    this.insertions = 0;
    this.deletions = 0;
  }
}

export default VisualisationFile;
