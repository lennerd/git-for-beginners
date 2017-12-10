import { observable, computed } from 'mobx';

class Chapter {
  @observable progress = 0;

  constructor(data) {
    Object.assign(this, data);
  }

  @computed get done() {
    return this.tutorial.currentChapterId > this.id;
  }
}

export default Chapter;
