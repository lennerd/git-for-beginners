/*import { computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import Section from './Section';

class Chapter {
  sections = [];

  static create(tutorial, { sections, ...data }) {
    const chapter = new this(tutorial, data);
    chapter.sections = sections.map(section => Section.create(tutorial, chapter, section));

    return chapter;
  }

  constructor(tutorial, data) {
    this.tutorial = tutorial;

    Object.assign(this, data);
  }

  @computed get completed() {
    return this.sections.every(section => section.completed);
  }

  @computed get completedSections() {
    return takeWhile(this.sections, 'completed');
  }

  @computed get allowsNextChapter() {
    return this.sections.length === this.visibleSections.length;
  }

  @computed get progress() {
    return this.completedSections.length / this.sections.length;
  }

  @computed get visibleSections() {
    return this.sections.slice(0, this.completedSections.length + 1);
  }
}*/
import { observable, toJS } from 'mobx';
import { serializable, identifier, custom } from 'serializr';

class Chapter {
  @serializable(identifier()) title;
  @serializable(custom((state) => toJS(state), (state) => state)) @observable state = {};
  @serializable @observable progress = 0;
  @serializable @observable completed = false;

  constructor(title, state = {}) {
    this.title = title;
    this.state = state;
  }

  is(title) {
    return this.title === title;
  }
}

export default Chapter;
