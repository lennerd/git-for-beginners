import { computed } from 'mobx';

import ConsoleObject from './ConsoleObject';

class ConsoleCommand extends ConsoleObject {
  isConsoleCommand = true;

  icon = '';
  action;
  payloadCreator = () => {};
  textOnly = false;

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

  @computed
  get payload() {
    return this.payloadCreator();
  }
}

export default ConsoleCommand;
