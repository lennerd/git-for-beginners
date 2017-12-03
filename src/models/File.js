import { observable } from 'mobx';

class File {
  @observable name;

  constructor(name) {
    this.name = name;
  }
}

export default File;
