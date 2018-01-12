import { computed, action, observable, toJS } from 'mobx';
import { serializable, list, createSimpleSchema, primitive, object, custom, SKIP } from 'serializr';
import takeWhile from 'lodash/takeWhile';

import Chapter from './Chapter';

var Action = createSimpleSchema({
  type: primitive(),
  payload: custom(
    (value) => value === undefined ? SKIP : toJS(value),
    (value) => value
  ),
});

class Tutorial {
  @serializable @observable currentChapterId;
  @serializable(list(object(Action))) @observable actions = [];
  chapters = [];

  static create({ chapters, ...data }) {
    const tutorial = new this(data);

    tutorial.chapters = chapters.map(chapter => Chapter.create(tutorial, chapter));
    tutorial.currentChapterId = chapters[0].id;

    return tutorial;
  }

  constructor(data) {
    Object.assign(this, data);
  }

  @computed get currentChapter() {
    return this.chapters.find(chapter => chapter.id === this.currentChapterId);
  }

  set currentChapter(currentChapter) {
    this.currentChapterId = currentChapter.id;
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
    const actionsRest = this.actions.slice();

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
    this.actions.push(action);
  }

  @action navigateToChapter(chapter) {
    if (!this.visibleChapters.includes(chapter)) {
      return;
    }

    this.currentChapter = chapter;
  }
}

export default Tutorial;
