import { computed } from 'mobx';

class Section {
  static create(tutorial, data) {
    return new this(tutorial, data);
  }

  constructor(tutorial, data) {
    this.tutorial = tutorial;

    Object.assign(this, data);
  }

  @computed get completed() {
    return this.tutorial.completedSections.indexOf(this) > -1;
  }
}

export default Section;
