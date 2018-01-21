import { computed } from 'mobx';
import uniqBy from 'lodash/uniqBy';

import VisualisationObject from './VisualisationObject';

class VisualisationFileList extends VisualisationObject {
  isFileList = true;

  @computed get files() {
    return this.filter(object => object.isFile && object.visible);
  }

  @computed get uniqueFiles() {
    return uniqBy(this.files, fileVis => fileVis.file);
  }

  @computed get height() {
    return this.uniqueFiles.length;
  }
}

export default VisualisationFileList;
