import { observable, computed } from "mobx";

import BaseObject from "./BaseObject";

class ConsoleObject extends BaseObject {
  @observable available = () => true;

  @computed get visibleCommands() {
    return this.commands.filter(command => {
      if (!command.available() || command.textOnly) {
        return false;
      }

      return command.commands.length === 0 || command.visibleCommands.length > 0;
    });
  }

  @computed get commands() {
    return this.children;
  }
}

export default ConsoleObject;
