import { observable, computed, action } from 'mobx';

export const ACTION_NEXT = Symbol('NEXT');

class Story {
  @observable actions = [];
  @observable nextActionIndex = 0;
  @observable nextChapter = false;

  @action add(name, handler) {
    if (name === ACTION_NEXT && handler == null) {
      handler = this.redirectToNextChapter;
    }

    this.actions.push({ name, handler });
  }

  @action next() {
    this.nextAction.handler.call(this);

    const nextActionIndex = this.nextActionIndex + 1;

    if (nextActionIndex < this.actions.length) {
      this.nextActionIndex = nextActionIndex;
    }
  }

  @action redirectToNextChapter() {
    this.nextChapter = true;
  }

  write() {
    return null;
  }

  visualise() {
    return null;
  }

  will(name) {
    return this.nextAction.name === name;
  }

  @computed get nextAction() {
    return this.actions[this.nextActionIndex];
  }

  @computed get progress() {
    if (this.actions.length === 0) {
      return 0;
    }

    return this.nextActionIndex / this.actions.length;
  }
}

export default Story;
