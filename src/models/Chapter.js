import { extendObservable, action, computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import { SECTION_TASK, SECTION_TEXT } from '../constants';
import { createAction } from './Action';
import TutorialChapter from '../components/TutorialChapter';

export const readOn = createAction('READ_ON');
export const init = createAction('INIT');

class ConsoleError extends Error {}

class Chapter {
  sections = [];
  console = null;
  vis = null;
  component = TutorialChapter;
  inheritFrom = null;

  constructor(id, state, tutorial) {
    this.id = id;
    this.state = state;
    this.tutorial = tutorial;
  }

  toString() {
    return this.id;
  }

  @computed get parent() {
    if (this.inheritFrom == null) {
      return null;
    }

    return this.tutorial.chapters.find(chapter => chapter.id === this.inheritFrom);
  }

  @computed get numberOfVisibleTextSections() {
    return this.state.filter(readOn).length + 1;
  }

  @computed get visibleSections() {
    let numberOfVisibleTextSections = this.numberOfVisibleTextSections;
    let prevTaskSectionDone = true;

    return takeWhile(this.sections, (section) => {
      if (section.is(SECTION_TEXT)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        if (section.skip) {
          return true;
        }

        if (numberOfVisibleTextSections === 0) {
          return false;
        }

        numberOfVisibleTextSections--;

        return true;
      }

      if (section.is(SECTION_TASK)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        prevTaskSectionDone = section.done;

        return true;
      }

      throw new Error('Unknown section type.');
    });
  }

  @computed get doableSections() {
    return this.sections.filter(section => {
      if (section.is(SECTION_TEXT)) {
        return !section.skip;
      }

      return section.is(SECTION_TASK);
    });
  }

  @computed get doneSections() {
    return this.visibleSections.filter(section => {
      if (section.is(SECTION_TEXT)) {
        return !section.skip;
      }

      if (section.is(SECTION_TASK)) {
        return section.done;
      }

      return false;
    });
  }

  @computed get progress() {
    return this.doneSections.length / this.doableSections.length;
  }

  @computed get completed() {
    return this.progress >= 1;
  }

  @action dispatch(action) {
    let data;

    try {
      if (this[action.type]) {
        data = this[action.type](action.payload);
      }
    } catch (error) {
      if (!(error instanceof ConsoleError)) {
        throw error;
      }

      console.error(error);

      if (this.console != null) {
        this.console.error(action, error);
      }

      return;
    }

    if (this.console != null) {
      this.console.log(action, data);
    }

    this.state.actions.push(action);

    return data;
  }

  @action reset() {
    this.state.actions = [];
  }

  handleActions(actionMap) {
    this.state.actions.forEach(action => {
      if (actionMap[action.type] != null) {
        actionMap[action.type](action.payload);
      }
    });
  }
}

export function createChapter(id, props) {
  const chapterCreator = (state, ...args) => extendObservable(new Chapter(id, state, ...args), props);
  chapterCreator.id = id;

  return chapterCreator;
}
