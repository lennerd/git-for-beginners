import { computed } from 'mobx';

import VisualisationObject from './VisualisationObject';

class VisualisationFileList extends VisualisationObject {
  isFileList = true;

  @computed get files() {
    return this.filter(object => object.isFile && object.visible);
  }
}

export default VisualisationFileList;
