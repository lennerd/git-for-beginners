import { extendObservable, computed } from 'mobx';

class Chapter {
  constructor(data) {
    extendObservable(this, data);
  }

  @computed get reached() {
    return this.sections.some(section => section.reached);
  }

  @computed get completed() {
    return this.sections.every(section => section.completed);
  }

  @computed get reachedSections() {
    return this.sections.filter(section => section.reached);
  }

  @computed get currentSection() {
    return this.reachedSections[this.reachedSections.length - 1];
  }

  @computed get nextSection() {
    return this.sections.find(section => !section.reached)
  }

  hasUnreachedSections() {
    return this.reachedSections.length < this.sections.length;
  }
}

export default Chapter;
