import uuid from 'uuid/v4';
import { observable, computed, action } from "mobx";
import sortBy from 'lodash/sortBy';

class CopyId {}

class BaseObject {
  id = uuid();

  @observable parent;
  @observable children = [];
  @observable copyId = new CopyId();

  @computed get nestedIndex() {
    const nestedIndex = [];

    if (this.parent == null) {
      return nestedIndex;
    }

    return [
      ...this.parent.nestedIndex,
      this.index,
    ];
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

  findCopies(object) {
    return this.filter(copy => copy !== object && copy.copyId === object.copyId);
  }

  at(currentIndex, ...nestedIndex) {
    if (currentIndex == null) {
      return this;
    }

    return this.children[currentIndex].at(...nestedIndex);
  }

  has(object) {
    if (this.children.includes(object)) {
      return true;
    }

    for (let child of this.children) {
      if (child.has(object)) {
        return true;
      }
    }

    return false;
  }

  @action add(...objects) {
    for (let object of objects) {
      if (this.children.includes(object)) {
        continue;
      }

      if (object.parent != null) {
        object.parent.remove(object);
      }

      object.parent = this;
      this.children.push(object);
    }
  }

  @action remove(...objects) {
    for (let object of objects) {
      const childIndex = this.children.indexOf(object);

      if (childIndex < 0) {
        continue;
      }

      object.parent = null;
      this.children.splice(childIndex, 1);
    }
  }

  @action sortBy(iteratees) {
    this.children = sortBy(this.children, iteratees);
  }

  @action copy(recursive = true) {
    const copy = new this.constructor();

    copy.copyId = this.copyId;

    if (recursive) {
      this.children.forEach(object => {
        copy.add(object.copy());
      });
    }

    return copy;
  }
}

export default BaseObject;
