import { computed, action, observable } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import ChapterState from './ChapterState';
import { init } from './Chapter';

class Tutorial {
  @observable chapters = [];

  constructor(state) {
    this.state = state;
  }

  @action init(chapterCreators) {
    this.chapterCreators = chapterCreators;

    this.chapters = chapterCreators.map(chapterCreator => {
      const chapterState = this.state.chapterStates.find(chapterState => (
        chapterState.chapterId === chapterCreator.id
      ));

      const chapter = chapterCreator(new ChapterState(chapterCreator.id));

      if (chapterState != null) {
        chapterState.actions.forEach(action => {
          chapter.dispatch(action);
        });
      } else {
        chapter.dispatch(init());
      }

      return chapter;
    });

    this.state.chapterStates = this.chapters.map(chapter => chapter.state);

    if (this.state.currentChapterId == null) {
      this.state.currentChapterId = this.chapters[0].id;
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
    this.chapters = this.chapterCreators.map((chapterCreator, index) => {
      if (this.currentChapterIndex > index) {
        return this.chapters[index];
      }

      const chapter = chapterCreator(new ChapterState(chapterCreator.id));
      chapter.dispatch(init());

      return chapter;
    });

    this.state.chapterStates = this.chapters.map(chapter => chapter.state);
  }

  @action navigate(chapter) {
    if (!this.accessibleChapters.includes(chapter)) {
      return;
    }

    this.currentChapter = chapter;
  }
}

export default Tutorial;
