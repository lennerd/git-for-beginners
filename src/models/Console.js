import uuid from 'uuid/v4';
import { observable, action, computed } from 'mobx';
//import lineParser from 'lineparser';
import minimist from 'minimist';
import splitargs from 'splitargs';

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

  @action
  log(action, data) {
    this.store(action, { data });
  }

  @action
  error(action, error) {
    this.store(action, { error });
  }

  @action
  store(action, data) {
    const command = this.find(
      command => command.action && action.is(command.action),
    );

    if (command == null) {
      return;
    }

    this.history.push(new ConsoleLog(action, command, { ...data }));
  }

  @computed
  get useInput() {
    return this.some(command => command.textOnly);
  }

  parse(line) {
    const args = splitargs(line);
    let command = this.children.find(
      command => command.textOnly && command.name === args[0],
    );

    if (command == null) {
      throw new Error('Unknown command');
    }

    const subcommand = command.children.find(
      subcommand => subcommand.textOnly && subcommand.name === args[1],
    );

    if (subcommand == null) {
      throw new Error('Unknown subcommand');
    }

    return {
      command: subcommand,
      args: minimist(args.slice(2)),
    };
  }
}

export default Console;
