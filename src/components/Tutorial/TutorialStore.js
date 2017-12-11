import { observable, action, extendObservable } from "mobx";

class Chapter {
  @observable progress = 0;

  constructor(data) {
    extendObservable(this, data);
  }

  @action reset() {
    this.progress = 0;
  }
}

class TutorialStore {
  constructor(chapters) {
    this.chapters = chapters.map(chapter => new Chapter(chapter));
  }

  findChapter(id) {
    return this.chapters.find(chapter => chapter.id === id);
  }

  progress(currentChapter) {
    const step = 1 / (this.chapters.length - 1);
    const currentIndex = this.chapters.indexOf(currentChapter);

    return step * currentIndex + step * currentChapter.progress;
  }

  done(chapter, currentChapter) {
    const index = this.chapters.indexOf(chapter);
    const currentIndex = this.chapters.indexOf(currentChapter);

    return index < currentIndex;
  }
}

export default TutorialStore;
