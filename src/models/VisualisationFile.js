import { observable, computed, action } from 'mobx';

import { STATUS_ADDED } from '../constants';

class VisualisationFile {
  @observable insertions = 0;
  @observable deletions = 0;
  @observable status = STATUS_ADDED;
  @observable active = false;
  @observable hover = false;
  @observable column = 0;
  @observable row = 0;
  @observable level = 0;
  @observable name;
  @observable visible = true;

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

  @action copy() {
    const file = new this.constructor();

    file.insertions = this.insertions;
    file.deletions = this.deletions;
    file.status = this.status;
    file.column = this.column;
    file.level = this.level;
    file.row = this.row;

    return file;
  }

  @action reset() {
    this.insertions = 0;
    this.deletions = 0;
  }
}

export default VisualisationFile;
