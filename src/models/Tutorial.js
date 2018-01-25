import { computed, action, observable } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import ChapterState from './ChapterState';
import { init } from './Chapter';
import { reset } from './chance';

class Tutorial {
  @observable chapters = [];

  constructor(state) {
    this.state = state;
  }

  @action
  init(chapterCreators) {
    this.chapterCreators = chapterCreators;

    // Create chapters
    this.chapters = chapterCreators.map(chapterCreator => {
      const chapterState =
        this.state.chapterStates.find(
          chapterState => chapterState.chapterId === chapterCreator.id,
        ) || new ChapterState(chapterCreator.id);

      return chapterCreator(chapterState, this);
    });

    this.navigate(this.currentChapter || this.chapters[0]);
  }

  @computed
  get currentChapterIndex() {
    return this.chapters.findIndex(
      chapter => chapter.id === this.state.currentChapterId,
    );
  }

  @computed
  get currentChapter() {
    return this.chapters[this.currentChapterIndex];
  }

  @computed
  get nextChapter() {
    return this.chapters[this.currentChapterIndex + 1];
  }

  @computed
  get accessibleChapters() {
    let lastCompleted = true;

    return takeWhile(this.chapters, chapter => {
      if (!lastCompleted) {
        return false;
      }

      lastCompleted = chapter.completed;

      return true;
    });
  }

  @computed
  get progress() {
    const chapterStep =
      this.chapters.length === 1 ? 1 : 1 / (this.chapters.length - 1);

    return this.accessibleChapters.reduce((progress, chapter) => {
      return progress + chapterStep * chapter.progress;
    }, 0);
  }

  @action.bound
  reset() {
    this.initNestedChapter(this.currentChapter, true);
    this.state.chapterStates = this.chapters.map(chapter => chapter.state);
    reset();
  }

  @action
  navigate(chapter) {
    if (!this.accessibleChapters.includes(chapter)) {
      return;
    }

    if (this.currentChapter != null && this.currentChapter.vis != null) {
      this.currentChapter.vis.active = false;
    }

    this.initChapter(chapter);

    this.state.currentChapterId = chapter.id;
  }

  @action
  initChapter(chapter) {
    this.initNestedChapter(chapter);

    this.state.chapterStates = this.chapters.map(chapter => chapter.state);
  }

  initNestedChapter(chapter, reset = false) {
    if (chapter.parent) {
      this.initNestedChapter(chapter.parent);
    }

    const chapterCreatorIndex = this.chapterCreators.findIndex(
      chapterCreator => chapterCreator.id === chapter.id,
    );
    const chapterCreator = this.chapterCreators[chapterCreatorIndex];
    const actions = chapter.state.actions.slice();

    chapter = chapterCreator(new ChapterState(chapterCreator.id), this);
    this.chapters.splice(chapterCreatorIndex, 1, chapter);

    if (actions.length === 0 || reset) {
      chapter.dispatch(init());
    } else {
      actions.forEach(action => {
        chapter.dispatch(action);
      });
    }
  }
}

export default Tutorial;
