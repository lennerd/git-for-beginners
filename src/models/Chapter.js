import { computed } from 'mobx';
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

  /*findNextSection(section) {
    const sectionIndex = this.sections.indexOf(section);

    if (sectionIndex < 0) {
      return null;
    }

    return this.sections[sectionIndex + 1];
  }*/
}

export default Chapter;
