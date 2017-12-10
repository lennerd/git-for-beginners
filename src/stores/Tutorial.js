
import { computed, action, observable } from 'mobx';

import chapters, { CHAPTER_TITLES } from '../components/chapters';
import Chapter from './Chapter';
import { FORWARD, BACK } from '../components/chapters/Chapter';

class Tutorial {
  @observable currentChapterId = 0;

  constructor() {
    this.chapters = chapters.map(
      (component, index) => new Chapter({
        tutorial: this,
        id: index + 1,
        component,
        title: CHAPTER_TITLES[index],
      })
    );
  }

  @action navigate(id) {
    this.currentChapterId = parseInt(id, 10);
  }

  @computed get direction() {
    if (this.prevChapterId == null) {
      this.prevChapterId = this.currentChapterId;

      return null;
    }

    const direction = this.currentChapterId > this.prevChapterId ? FORWARD : BACK;
    this.prevChapterId = this.currentChapterId;

    return direction;
  }

  @computed get currentChapter() {
    return this.chapters.find(chapter => chapter.id === this.currentChapterId);
  }

  @computed get totalProgress() {
    if (this.currentChapter == null) {
      return 0;
    }

    const step = 1 / (this.chapters.length - 1);
    const index = this.chapters.indexOf(this.currentChapter);

    return step * index + step * this.currentChapter.progress;
  }
}

export default Tutorial;
