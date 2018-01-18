import { computed } from 'mobx';

import VisualisationObject from './VisualisationObject';
//import { STATUS_DELETED, STATUS_ADDED, STATUS_MODIFIED } from '../constants';

class VisualisationFileList extends VisualisationObject {
  isFileList = true;

  @computed get files() {
    const files = this.filter(object => object.isFile && object.visible);

    /*files.sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === STATUS_MODIFIED || a.status === STATUS_DELETED) {
          return -1;
        }

        if (a.status === STATUS_ADDED) {
          return 1;
        }
      }

      if (a.insertions > b.insertions) {
        return 1;
      }

      if (a.deletions > b.deletions) {
        return -1;
      }

      return 0;
    });*/

    return files;
  }
}

export default VisualisationFileList;
