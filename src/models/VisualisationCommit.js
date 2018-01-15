import { observable } from 'mobx';

class VisualisationCommit {
  @observable files = [];

  constructor(files = []) {
    this.files = files;
  }
}

export default VisualisationCommit;
