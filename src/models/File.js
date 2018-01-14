import uuid from 'uuid/v4';
import { serializable, identifier } from 'serializr';
import { observable, computed, action } from 'mobx';

class File {
  @serializable(identifier()) id = uuid();
  @serializable @observable column = 0;
  @serializable @observable level = 0;
  @serializable @observable row = 0;
  @observable hover = false;
  @serializable @observable active = false;
  @serializable @observable insertions = 0;
  @serializable @observable deletions = 0;

  @computed get modified() {
    return this.insertions > 0 || this.deletions > 0;
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
}

export default File;
