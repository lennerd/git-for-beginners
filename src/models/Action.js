import { serializable, primitive, custom, SKIP } from "serializr";
import { action, computed } from "mobx";

class Action {
  @serializable(primitive()) type;
  @serializable(custom(
    value => value === undefined ? SKIP : value,
    json => json
  )) payload;

  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }

  is(type) {
    return this.type === type.toString();
  }
}

export function createAction(type, payloadCreator = payload => payload) {
  const typeString = type.toString();

  const actionCreator = (...args) => {
    return new Action(type, payloadCreator(...args));
  };

  actionCreator.toString = () => {
    return typeString;
  };

  return actionCreator;
}

export function dispatch(actionCreator) {
  return action.bound(function() {
    this.dispatch(actionCreator());
  })
}

export function has(actionCreator) {
  return computed(function() {
    return this.state.has(actionCreator);
  });
}

export function hasMin(actionCreate, min) {
  return computed(function() {
    return this.state.filter(actionCreate).length >= min;
  });
}

export default Action;
