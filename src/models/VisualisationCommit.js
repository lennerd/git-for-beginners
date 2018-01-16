import { observable, computed } from 'mobx';

import VisualisationFileList from './VisualisationFileList';

class VisualisationCommit extends VisualisationFileList {
  @observable hoverCommit = false;
  @observable commitActive = false;

  @computed get active() {
    return this.files.some(file => file.active);
  }

  set active(active) {
    this.files.forEach(file => {
      file.active = active;
    });
  }
}

export default VisualisationCommit;
