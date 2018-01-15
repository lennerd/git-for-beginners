import uuid from 'uuid/v4';
import { serializable, identifier } from 'serializr';
import { observable, computed, action } from 'mobx';

import { STATUS_ADDED } from '../constants';
import stateMapSchema from './stateMapSchema';

class VisualisationFile {
  @serializable(identifier()) id = uuid();
  @serializable @observable insertions = 0;
  @serializable @observable deletions = 0;
  @serializable @observable status = STATUS_ADDED;
  @serializable @observable active = false;
  @serializable(stateMapSchema) @observable state = new Map();
  @observable hover = false;

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

    return file;
  }

  @action reset() {
    this.insertions = 0;
    this.deletions = 0;
  }
}

export default VisualisationFile;
