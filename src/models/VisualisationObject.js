import uuid from 'uuid/v4';
import { observable, computed, action } from "mobx";

class VisualisationObject {
  isObject = true;
  id = uuid();

  @observable parent;
  @observable children = [];
  @observable column = 0;
  @observable row = 0;
  @observable level = 0;
  @observable hover = false;
  @observable active = false;
  @observable visible = true;

  getPosition() {
    const position = {
      column: this.column,
      row: this.row,
      level: this.level,
    };

    if (this.parent != null) {
      position.column += this.parent.position.column;
      position.row += this.parent.position.row;
      position.level += this.parent.position.level;
    }

    return position;
  }

  @computed get position() {
    return this.getPosition();
  };

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

  get(id) {
    return this.find(object => object.id === id);
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

      if (childIndex < -1) {
        continue;
      }

      object.parent = null;
      this.children.splice(childIndex, 1);
    }
  }

  @action copy(recursive = true) {
    const copy = new this.constructor();

    if (recursive) {
      this.children.forEach(object => {
        copy.add(object.copy());
      });
    }

    copy.column = this.column;
    copy.level = this.level;
    copy.row = this.row;

    copy.visible = this.visible;

    return copy;
  }
}

export default VisualisationObject;
