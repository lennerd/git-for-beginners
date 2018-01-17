import { computed } from 'mobx';
import sha1 from 'js-sha1';

import VisualisationFileList from './VisualisationFileList';

class VisualisationCommit extends VisualisationFileList {
  isCommit = true;

  getPosition() {
    const position = super.getPosition();

    if (this.parent != null && this.parent.isRepository) {
      position.row += this.parent.commits.length - (this.parent.commits.indexOf(this) + 1);
    }

    return position;
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
