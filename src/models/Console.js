import uuid from 'uuid/v4';
import { observable, action, computed } from 'mobx';

import ConsoleObject from './ConsoleObject';

class ConsoleLog {
  id = uuid();

  constructor(action, command, data) {
    Object.assign(this, {
      ...data,
      action,
      command,
    });
  }
}

class Console extends ConsoleObject {
  isConsole = true;
  payloadElement = () => {};

  constructor(data) {
    super();

    Object.assign(this, data);
  }

  @observable history = [];

  @action log(action, data) {
    this.store(action, { data });
  }

  @action error(action, error) {
    this.store(action, { error });
  }

  @action store(action, data) {
    const command = this.find(command => command.action && action.is(command.action));

    if (command == null) {
      return;
    }

    this.history.push(new ConsoleLog(action, command, { ...data }));
  }

  @computed get useInput() {
    return this.children.some(command => command.textOnly);
  }

  getCommand(input) {
    return this.children.find(command => command.name === input.trim());
  }
}

export default Console;
