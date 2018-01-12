import { serializable, list, createSimpleSchema, primitive, object, custom, SKIP } from 'serializr';
import { observable, toJS } from 'mobx';

var Action = createSimpleSchema({
  type: primitive(),
  payload: custom(
    (value) => value === undefined ? SKIP : toJS(value),
    (value) => value
  ),
});

class TutorialState {
  @serializable @observable currentChapterId;
  @serializable(list(object(Action))) @observable actions = [];

  static create({ chapters }) {
    const state = new TutorialState();

    state.currentChapterId = chapters[0].id;

    return state;
  }
}

export default TutorialState;
