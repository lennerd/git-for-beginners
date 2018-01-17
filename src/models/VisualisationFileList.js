import { computed } from 'mobx';

import VisualisationObject from './VisualisationObject';

class VisualisationFileList extends VisualisationObject {
  isFileList = true;

  @computed get files() {
    return this.filter(object => object.isFile);
  }

  @computed get maxChanges() {
    return Math.max(
      ...this.files.map(file => file.changes),
    );
  }
}

export default VisualisationFileList;
