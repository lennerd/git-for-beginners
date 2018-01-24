import { observable, action, computed } from 'mobx';

import VisualisationFile from '../vis/VisualisationFile';
import { STATUS_UNMODIFIED, STATUS_MODIFIED } from '../../constants';
import chance from '../chance';

class SimpleFileVisualisation extends VisualisationFile {
  @observable diff = { added: 0, removed: 0 };
  @observable status = STATUS_UNMODIFIED;

  @action
  modify() {
    this.diff = chance.diff(this.diff);
    this.status = STATUS_MODIFIED;
  }

  @computed
  get maxChanges() {
    return this.diff.added + this.diff.removed;
  }

  @action
  toggle() {
    this.visible = !this.visible;
  }

  @action
  copy() {
    const copy = super.copy();
    copy.diff = { ...this.diff };
    return copy;
  }
}

export default SimpleFileVisualisation;
