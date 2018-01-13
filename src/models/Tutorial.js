import { serializable, object, list, reference } from "serializr";
import { observable, computed, action } from 'mobx';

import Chapter from "./Chapter";

class Tutorial {
  @serializable(list(object(Chapter))) chapters = [];
  @serializable(reference(Chapter)) @observable currentChapter;

  constructor(chapters) {
    this.chapters = chapters;

    this.currentChapter = this.chapters[0];
  }

  @computed get nextChapter() {
    const currentIndex = this.chapters.indexOf(this.currentChapter);

    return this.chapters[currentIndex + 1];
  }

  @computed get progress() {
    const chapterStep = this.chapters.length === 1 ? 1 : 1 / (this.chapters.length - 1);

    return this.chapters.reduce((progress, chapter) => {
      return progress + chapterStep * chapter.progress;
    }, 0);
  }

  @action.bound turnOver(chapter = this.nextChapter) {
    const index = this.chapters.indexOf(chapter);
    const prevChapter = this.chapters[index - 1];

    if (prevChapter != null && !prevChapter.completed) {
      return;
    }

    this.currentChapter = chapter;
  };
}

export default Tutorial;
