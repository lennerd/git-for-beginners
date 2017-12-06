import { observable, action } from 'mobx';
import uuid from 'uuid/v4';

class Model {
  @observable children = [];
  @observable parent;

  constructor(children) {
    this.id = uuid();
    this.type = this.constructor.type;

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

export default Model;
