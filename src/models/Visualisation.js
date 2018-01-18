import { computed } from "mobx";

import VisualisationObject from "./VisualisationObject";

class Visualisation extends VisualisationObject {
  isVisulisation = true;

  @computed get files() {
    return this.filter(object => object.isFile);
  }

  @computed get commits() {
    return this.filter(object => object.isCommit);
  }

  @computed get areas() {
    return this.filter(object => object.isArea);
  }

  @computed get maxChanges() {
    return Math.max(
      ...this.files.map(file => file.changes),
    );
  }
}

export default Visualisation;
