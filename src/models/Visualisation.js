import { observable, computed, action } from "mobx";

class Visualisation {
  @observable files = [];
  @observable areas = [];
  @observable fileLists = [];

  @computed get hover() {
    return this.files.some(file => file.hover) ||
      this.fileLists.some(fileList => fileList.hover);
  }

  @computed get activeFileIndex() {
    return this.files.findIndex(file => file.active);
  }

  @computed get activeFile() {
    return this.files[this.activeFileIndex];
  }

  @computed get lastFile() {
    return this.files[this.files.length - 1];
  }

  @action deactivateAll() {
    this.files.forEach((file) => {
      file.active = false;
    });
  }

  @action activate(model) {
    this.deactivateAll();

    model.active = true;
  }
}

export default Visualisation;
