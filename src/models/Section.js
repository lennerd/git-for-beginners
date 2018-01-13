/*import { computed } from 'mobx';

class Section {
  static create(tutorial, chapter, data) {
    return new this(tutorial, chapter, data);
  }

  constructor(tutorial, chapter, data) {
    this.tutorial = tutorial;
    this.chapter = chapter;

    Object.assign(this, data);
  }

  @computed get completed() {
    return this.tutorial.completedSections.indexOf(this) > -1;
  }

  @computed get last() {
    return this.chapter.sections.indexOf(this) === (this.chapter.sections.length - 1);
  }
}

export default Section;*/
