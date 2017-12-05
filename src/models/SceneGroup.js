import { observable, action } from 'mobx';

import SceneObject from './SceneObject';

class SceneGroup extends SceneObject {
  @observable children = [];

  constructor(children) {
    super();

    if (Array.isArray(children)) {
      children.forEach((child) => {
        this.add(child);
      });
    }
  }

  @action add(child) {
    if (child.parent != null) {
      child.parent.remove(child);
    }

    this.children.push(child);
    child.parent = this;
  }

  @action remove(child) {
    this.children.remove(child);
    child.parent = null;
  }
}

export default SceneGroup;
