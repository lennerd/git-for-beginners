import uuid from 'uuid/v4';
import { computed } from "mobx";

class BaseObject {
  @computed get id() {
    return this.getId();
  }

  @computed get parent() {
    return this.getParent();
  }

  @computed get children() {
    return this.getChildren();
  }

  getId() {
    return uuid();
  }

  getParent() {
    throw new Error(`getParent() in ${this.constructor.name} not implemented`);
  }

  getChildren() {
    throw new Error(`getChildren() in ${this.constructor.name} not implemented`);
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
}

export default BaseObject;
