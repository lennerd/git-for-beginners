import { observable, action, toJS } from 'mobx';
import {
  serializable,
  identifier,
  object,
  custom,
} from 'serializr';

import Visualisation from './Visualisation';

const stateSchema = custom(
  value => toJS(value),
  value => observable.map(value),
);

class Chapter {
  @serializable(identifier()) title;
  @serializable @observable progress = 0;
  @serializable @observable completed = false;
  @serializable @observable visibleTextSections = 1;
  @serializable(object(Visualisation)) @observable vis = new Visualisation();
  @serializable(stateSchema) @observable state = new Map();

  constructor(title, data) {
    this.title = title;

    Object.assign(this, data);
  }

  is(title) {
    return this.title === title;
  }

  @action reset() {
    this.progress = 0;
    this.completed = false;
    this.visibleTextSections = 1;
    this.vis = new Visualisation();
    this.state = new Map();
  }
}

export default Chapter;
