import uuid from 'uuid/v4';
import { extendObservable } from "mobx";

class ConsoleCommand {
  id = uuid();
  icon = '';
  commands = [];
  available = true;

  constructor(name, options) {
    extendObservable(this, {
      ...options,
      name,
    });
  }

  run() {
    console.error('Missing run.');
  }
}

export default ConsoleCommand;
