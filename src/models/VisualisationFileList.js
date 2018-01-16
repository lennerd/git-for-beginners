import { observable, computed, action } from 'mobx';

class VisualisationFileList {
  @observable files = [];
  @observable column = 0;
  @observable row = 0;

  @computed get maxChanges() {
    return Math.max(
      ...this.files.map(file => file.changes),
    );
  }

  @computed get hover() {
    return this.files.some(file => file.hover);
  }

  @action copy() {
    const fileList = new this.constructor();
    fileList.files = this.files.map(file => file.copy());
    fileList.column = this.column;
    fileList.row = this.row;

    return fileList;
  }
}

export default VisualisationFileList;
