import { computed, action } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import ChapterState from './ChapterState';

class Tutorial {
  constructor(state) {
    this.state = state;
  }

  @action register(chapterCreators) {
    this.chapters = chapterCreators.map(chapterCreator => {
      const chapterState = this.state.chapterStates.find(chapterState => (
        chapterState.chapterId === chapterCreator.id
      )) || new ChapterState(chapterCreator.id);

      return chapterCreator(chapterState);
    });

    this.state.chapterStates = this.chapters.map(chapter => chapter.state);

    if (this.state.currentChapterId == null) {
      this.state.currentChapterId = chapterCreators[0].id;
    }
  }

  @computed get currentChapterIndex() {
    return this.chapters.findIndex(chapter => chapter.id === this.state.currentChapterId);
  }

  @computed get currentChapter() {
    return this.chapters[this.currentChapterIndex];
  }

  set currentChapter(currentChapter) {
    this.state.currentChapterId = currentChapter.id;
  }

  @computed get nextChapter() {
    return this.chapters[this.currentChapterIndex + 1];
  }

  @computed get accessibleChapters() {
    let lastCompleted = true;

    return takeWhile(this.chapters, chapter => {
      if (!lastCompleted) {
        return false;
      }

      lastCompleted = chapter.completed;

      return true;
    });
  }

  @computed get progress() {
    const chapterStep = this.chapters.length === 1 ? 1 : 1 / (this.chapters.length - 1);

    return this.accessibleChapters.reduce((progress, chapter) => {
      return progress + chapterStep * chapter.progress;
    }, 0);
  }

  @action.bound reset() {
    this.chapters.slice(this.currentChapterIndex).forEach(chapter => chapter.reset());
  }

  @action navigate(chapter) {
    if (!this.accessibleChapters.includes(chapter)) {
      return;
    }

    this.currentChapter = chapter;
  }
}

export default Tutorial;
