import { observable, computed } from 'mobx';
import sha1 from 'js-sha1';

import VisualisationFileList from './VisualisationFileList';

class VisualisationCommit extends VisualisationFileList {
  isCommit = true;

  @observable parentCommit;

  getPosition() {
    const position = super.getPosition();

    if (this.parent != null && this.parent.isRepository) {
      position.row += this.parent.commits.length - (this.parent.commits.indexOf(this) + 1);
    }

    return position;
  }

  @computed get committed() {
    if (this.parent == null) {
      return false;
    }

    let parent = this.parent;

    while (parent != null) {
      if (parent.isStagingArea) {
        return false;
      }

      if (parent.isRepository) {
        return true;
      }

      parent = parent.parent;
    }

    return false;
  }

  @computed get checksum() {
    return sha1(JSON.stringify({
      id: this.id,
      files: this.files.map(file => file.id),
    }));
  }

  @computed get checksumShort() {
    return this.checksum.substring(0, 7);
  }

  @computed get height() {
    return this.files.length;
  }
}

export default VisualisationCommit;
