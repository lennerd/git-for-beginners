import { observable, computed, action } from "mobx";
import { serializable, list, object } from "serializr";

import VisualisationFile from "./VisualisationFile";

class Visualisation {
  @observable @serializable(list(object(VisualisationFile))) files = [];

  @computed get hover() {
    return this.files.some(file => file.hover);
  }

  @computed get activeFile() {
    return this.files.find(file => file.active);
  }

  @computed get hasModifiedFiles() {
    return this.files.some(file => file.modified);
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

  @action addFile(file) {
    this.files.push(file);
  }
}

export default Visualisation;
