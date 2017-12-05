import { observable } from 'mobx';
import uuid from 'uuid/v4';

class SceneObject {
  @observable parent;

  constructor() {
    this.id = uuid();
  }
}

export default SceneObject;
