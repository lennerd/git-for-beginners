import { observable, toJS } from 'mobx';
import { serializable, identifier, custom } from 'serializr';

class Chapter {
  @serializable(identifier()) title;
  @serializable(custom(
    state => toJS(state),
    state => observable.map(state)
  )) @observable state = new Map();
  @serializable @observable progress = 0;
  @serializable @observable completed = false;

  constructor(title, state = {}) {
    this.title = title;
    this.state.merge(state);
  }

  is(title) {
    return this.title === title;
  }
}

export default Chapter;
