import { observable } from 'mobx';

class Commit {
  @observable files = [];

  constructor(files) {
    this.files = files;
  }
}

export default Commit;
