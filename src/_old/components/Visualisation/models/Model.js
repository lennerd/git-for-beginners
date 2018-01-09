import { observable, action } from 'mobx';
import uuid from 'uuid/v4';

class Model {
  @observable children = [];
  @observable parent;

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

  @action addFront(child) {
    if (child.parent != null) {
      child.parent.remove(child);
    }

    this.children.unshift(child);
    child.parent = this;
  }

  @action remove(child) {
    this.children.remove(child);
    child.parent = null;
  }

  clone() {
    const children = this.children.map(child => child.clone());
    const clone = new this.constructor(children);

    if (this.parent != null) {
      this.parent.add(clone);
    }

    return clone;
  }
}

export default Model;
