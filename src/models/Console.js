import uuid from 'uuid/v4';
import { observable, action } from 'mobx';

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
}

export default Console;
