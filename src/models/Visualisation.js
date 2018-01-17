import { computed, action } from "mobx";

import VisualisationObject from "./VisualisationObject";

class Visualisation extends VisualisationObject {
  isVisulisation = true;

  @computed get hasHoveredObject() {
    return this.some(object => object.hover);
  }

  @computed get files() {
    return this.filter(object => object.isFile);
  }

  @computed get commits() {
    return this.filter(object => object.isCommit);
  }

  @computed get areas() {
    return this.filter(object => object.isArea);
  }

  @action deactivateAll() {
    this.traverse(object => {
      object.active = false;
    });
  }
}

export default Visualisation;
