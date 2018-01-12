import { computed, action } from 'mobx';
import { serializable, object } from 'serializr';
import takeWhile from 'lodash/takeWhile';

import Chapter from './Chapter';
import TutorialState from './TutorialState';

class Tutorial {
  @serializable(object(TutorialState)) state;
  chapters = [];

  static create({ chapters, ...data }) {
    const tutorial = new this({
      ...data,
      state: TutorialState.create({ chapters }),
    });

    tutorial.chapters = chapters.map(chapter => Chapter.create(tutorial, chapter));

    return tutorial;
  }

  constructor(data) {
    Object.assign(this, data);
  }

  @computed get currentChapter() {
    return this.chapters.find(chapter => chapter.id === this.state.currentChapterId);
  }

  set currentChapter(currentChapter) {
    this.state.currentChapterId = currentChapter.id;
  }

  @computed get nextChapter() {
    const currentIndex = this.chapters.indexOf(this.currentChapter);

    return this.chapters[currentIndex + 1];
  }

  @computed get sections() {
    return [].concat(
      ...this.chapters.map(chapter => chapter.sections),
    );
  }

  @computed get completedChapters() {
    return takeWhile(this.chapters, 'completed');
  }

  @computed get visibleChapters() {
    return this.chapters.slice(0, this.completedChapters.length + 1);
  }

  @computed get completedSections() {
    const { actions } = this.state;

    const actionsRest = actions.slice();

    return takeWhile(this.sections, section => {
      const actionType = section.action.toString();
      let action;

      while((action = actionsRest.shift()) != null) { // eslint-disable-line no-cond-assign
        if (actionType === action.type) {
          return true;
        }
      }

      return false;
    });
  }

  @computed get progress() {
    const chapterStep = this.chapters.length === 1 ? 1 : 1 / (this.chapters.length - 1);

    return this.chapters.reduce((progress, chapter) => {
      return progress + chapterStep * chapter.progress;
    }, 0);
  }

  @action do(action) {
    this.state.actions.push(action);
  }

  @action navigateToChapter(chapter) {
    if (!this.visibleChapters.includes(chapter)) {
      return;
    }

    this.currentChapter = chapter;
  }
}

export default Tutorial;
