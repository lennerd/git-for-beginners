import { observable } from 'mobx';
import { serializable, identifier, list, object } from 'serializr';

import Action from './Action';

class ChapterState {
  @serializable(identifier())
  chapterId;

  @serializable(list(object(Action)))
  @observable
  actions = [];

  @serializable
  @observable
  progress = 0;

  constructor(chapterId) {
    this.chapterId = chapterId;
  }

  filter(type) {
    return this.actions.filter(action => action.is(type));
  }

  find(type) {
    return this.actions.find(action => action.is(type));
  }

  has(type) {
    return this.find(type) != null;
  }
}

export default ChapterState;
