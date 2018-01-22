import { computed } from 'mobx';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';

import VisualisationObject from './VisualisationObject';

class VisualisationFileList extends VisualisationObject {
  isFileList = true;

  @computed get files() {
    return sortBy(this.filter(object => object.isFile && object.visible), fileVis => fileVis.file.name);
  }

  @computed get uniqueFiles() {
    return uniqBy(this.files, fileVis => fileVis.file);
  }

  @computed get height() {
    return this.uniqueFiles.length;
  }
}

export default VisualisationFileList;
