import { observable } from 'mobx';
import {
  serializable,
  identifier,
  object,
} from 'serializr';

import Visualisation from './Visualisation';

class Chapter {
  @serializable(identifier()) title;
  @serializable @observable progress = 0;
  @serializable @observable completed = false;
  @serializable @observable visibleTextSections = 1;
  @serializable(object(Visualisation)) @observable vis = new Visualisation();

  constructor(title, data) {
    this.title = title;

    Object.assign(this, data);
  }

  is(title) {
    return this.title === title;
  }
}

export default Chapter;
