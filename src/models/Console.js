import uuid from 'uuid/v4';
import { observable, computed, action } from 'mobx';

import BaseObject from './BaseObject';

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

class Console extends BaseObject {
  isConsole = true;

  @observable history = [];

  @computed get visibleCommands() {
    return this.children.filter((command) => {
      if (!command.available()) {
        return false;
      }

      if (command.children.length > 0) {
        return command.children.some(command => command.available);
      }

      return true;
    });
  }

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
}

export default Console;
