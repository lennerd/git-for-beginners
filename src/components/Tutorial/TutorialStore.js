import { observable, action, computed, extendObservable } from "mobx";

class Chapter {
  @observable story;
  @observable resets = 0;

  constructor(tutorial, data) {
    this.tutorial = tutorial;

    extendObservable(this, data);
  }

  @action reset() {
    this.resets++;
  }

  @computed get key() {
    return `${this.index}-${this.resets}`;
  }

  @computed get index() {
    return this.tutorial.chapters.indexOf(this);
  }

  @computed get active() {
    return this.index === this.tutorial.currentChapter.index;
  }

  @computed get done() {
    return this.index < this.tutorial.currentChapter.index;
  }

  @computed get nextChapter() {
    const index = this.index;
    const nextIndex = index + 1;

    if (nextIndex >= this.tutorial.chapters.length) {
      return null;
    }

    return this.tutorial.chapters[nextIndex];
  }
}

class TutorialStore {
  @observable currentChapterIndex;

  constructor(chapters) {
    this.chapters = chapters.map(chapter => new Chapter(this, chapter));
  }

  @computed get currentChapter() {
    return this.chapters[this.currentChapterIndex];
  }

  @computed get progress() {
    if (this.currentChapter == null) {
      return null;
    }

    const step = 1 / (this.chapters.length - 1);
    let progress = step * this.currentChapter.index;

    if (this.currentChapter.story != null) {
      progress += step * this.currentChapter.story.progress;
    }

    return progress;
  }
}

export default TutorialStore;
