import { extendObservable, action, computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import { SECTION_TASK, SECTION_TEXT } from '../constants';
import { createAction } from './Action';
import TutorialChapter from '../components/TutorialChapter';

export const readOn = createAction('READ_ON');

class Chapter {
  sections = [];
  commands = null;
  vis = null;
  component = TutorialChapter;

  constructor(id, state) {
    this.id = id;
    this.state = state;
  }

  toString() {
    return this.id;
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
    return this.sections.filter((section) => (
      !section.is(SECTION_TEXT) || !section.skip
    ));
  }

  @computed get doneSections() {
    return this.visibleSections.filter((section) => (
      !section.is(SECTION_TEXT) || !section.skip
    ));
  }

  @computed get progress() {
    return this.doneSections.length / this.doableSections.length;
  }

  @computed get completed() {
    return this.progress >= 1;
  }

  @action dispatch(action) {
    this.state.actions.push(action);
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
  const chapterCreator = state => extendObservable(new Chapter(id, state), props);
  chapterCreator.id = id;

  return chapterCreator;
}
