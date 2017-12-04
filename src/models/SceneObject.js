import { observable, action } from 'mobx';
import uuid from 'uuid/v4';

import Position from './Position';

class SceneObject {
  @observable parent;
  @observable position = new Position();
  @observable children = [];

  constructor(children) {
    this.id = uuid();

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

export default SceneObject;
