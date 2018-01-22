import { observable, computed, action } from "mobx";
import BaseObject from '../BaseObject';

class VisualisationObject extends BaseObject {
  isObject = true;

  @observable column = 0;
  @observable row = 0;
  @observable level = 0;
  @observable directHover = false;
  @observable directActive = false;
  @observable visible = true;
  //@observable prevPosition;

  @computed get hover() {
    return this.some(object => object.directHover);
  }

  set hover(hover) {
    this.traverse(object => {
      object.directHover = hover;
    });
  }

  @computed get active() {
    return this.some(object => object.directActive);
  }

  set active(active) {
    this.traverse(object => {
      object.directActive = active;
    });
  }

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
  }

  @action copy(...args) {
    const copy = new this.constructor(...args);

    copy.column = this.column;
    copy.row = this.row;
    copy.level = this.level;

    return copy;
  }
}

export default VisualisationObject;
