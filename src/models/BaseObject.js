import uuid from 'uuid/v4';
import { computed, action, observable } from "mobx";

class BaseObject {
  @observable children = [];
  @observable parent = null;

  @computed get id() {
    return this.getId();
  }

  @action set(...children) {
    this.remove(...this.children);
    this.add(...children);
  }

  @action add(...children) {
    for (let child of children) {
      if (this.children.includes(child)) {
        continue;
      }

      if (child.parent != null) {
        child.parent.remove(child);
      }

      child.parent = this;
      this.children.push(child);
    }
  }

  @action remove(...children) {
    for (let child of children) {
      if (!this.children.includes(child)) {
        continue;
      }

      child.parent = null;
      this.children.remove(child);
    }
  }

  getId() {
    return uuid();
  }

  @computed get index() {
    if (this.parent == null) {
      return -1;
    }

    return this.parent.children.indexOf(this);
  }

  traverse(callback) {
    callback(this);

    for (let child of this.children) {
      child.traverse(callback);
    }
  }

  filter(callback) {
    const objects = [];

    this.traverse((object) => {
      if (callback(object)) {
        objects.push(object);
      }
    });

    return objects;
  }

  map(callback) {
    const values = [];

    this.traverse((object) => {
      values.push(callback(object));
    });

    return values;
  }

  some(callback) {
    if (callback(this)) {
      return true;
    }

    for (let child of this.children) {
      if (child.some(callback)) {
        return true;
      }
    }

    return false;
  }

  find(callback) {
    if (callback(this)) {
      return this;
    }

    for (let child of this.children) {
      const object = child.find(callback);

      if (object != null) {
        return object;
      }
    }

    return null;
  }

  @action copy(...args) {
    return new this.constructor(...args);
  }
}

export default BaseObject;
