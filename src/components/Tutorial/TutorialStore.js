import { observable, action, computed, extendObservable } from "mobx";

class Chapter {
  @observable story;

  constructor(tutorial, data) {
    this.tutorial = tutorial;

    extendObservable(this, data);
  }

  @action setStory(story) {
    this.story = story
  }

  @computed get index() {
    return this.tutorial.chapters.indexOf(this);
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
  @observable currentChapterId;

  constructor(chapters) {
    this.chapters = chapters.map(chapter => new Chapter(this, chapter));
  }

  @action navigate(chapterId) {
    this.currentChapterId = chapterId;
  }

  @computed get currentChapter() {
    return this.chapters.find(chapter => chapter.id === this.currentChapterId);
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
