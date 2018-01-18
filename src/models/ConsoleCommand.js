import { observable, computed } from "mobx";

import BaseObject from './BaseObject';

class ConsoleCommand extends BaseObject {
  isConsoleCommand = true;

  @observable icon = '';
  @observable available = () => {};
  @observable action;
  @observable payloadCreator = () => {};

  constructor(name, { commands, ...options }) {
    super();

    Object.assign(this, {
      ...options,
      name,
    });

    if (commands != null) {
      this.add(...commands);
    }
  }

  @computed get commands() {
    return this.children;
  }

  @computed get payload() {
    return this.payloadCreator();
  }
}

export default ConsoleCommand;
