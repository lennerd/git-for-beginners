import { observable, computed } from "mobx";
import { serializable, list, object } from "serializr";

import File from "./File";

class Visualisation {
  @observable @serializable(list(object(File))) files = [];

  @computed get hover() {
    return this.files.some(file => file.hover);
  }
}

export default Visualisation;
