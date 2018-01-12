import { serializable, list, createSimpleSchema, primitive, object, custom, SKIP } from 'serializr';
import { observable, toJS } from 'mobx';

var Action = createSimpleSchema({
  type: primitive(),
  payload: custom(
    (value) => value === undefined ? SKIP : toJS(value),
    (value) => value
  ),
});

var Milestone = createSimpleSchema({
  chapterId: primitive(),
  index: primitive(),
});

class TutorialState {
  @serializable @observable currentChapterId;
  @serializable(list(object(Action))) @observable actions = [];
  @serializable(list(object(Milestone))) @observable milestones = [];

  static create({ chapters }) {
    const state = new TutorialState();

    state.currentChapterId = chapters[0].id;

    return state;
  }
}

export default TutorialState;
