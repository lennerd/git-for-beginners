import { computed } from "mobx";

import VisualisationObject from "./VisualisationObject";

class Visualisation extends VisualisationObject {
  isVisulisation = true;

  @computed get visFiles() {
    return this.filter(object => object.isFile);
  }

  @computed get visFileLists() {
    return this.filter(object => object.isFileList);
  }

  @computed get visAreas() {
    return this.filter(object => object.isArea);
  }

  @computed get maxChanges() {
    return Math.max(
      ...this.visFiles.map(file => file.changes),
    );
  }
}

export default Visualisation;
