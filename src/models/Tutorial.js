import { extendObservable, computed, observable, action } from 'mobx';

class Tutorial {
  @observable currentChapter;

  constructor(data) {
    extendObservable(this, data);
  }

  @computed get reachedChapters() {
    return this.chapters.filter(chapter => chapter.reached);
  }

  @computed get completedChapters() {
    return this.chapters.filter(chapter => chapter.completed);
  }

  @computed get progress() {
    const lastReachedChapter = this.reachedChapters[this.reachedChapters.length - 1];
    const { sections, reachedSections } = lastReachedChapter;

    const chapterStep = this.chapters.length === 1 ? 1 : 1 / (this.chapters.length - 1);
    const sectionStep = sections.length === 1 ? chapterStep : chapterStep / (sections.length);

    return chapterStep * this.completedChapters.length + sectionStep * (reachedSections.length - 1);
  }

  getNextChapter(chapter) {
    const index = this.chapters.indexOf(chapter);

    return this.chapters[index + 1];
  }

  getPrevChapter(chapter) {
    const index = this.chapters.indexOf(chapter);

    return this.chapters[index - 1];
  }

  @action activateChapter(chapter) {
    const prevChapter = this.getPrevChapter(chapter);

    if (prevChapter != null && !prevChapter.completed) {
      return false;
    }

    this.currentChapter = chapter;

    return true;
  }

  @action readOn() {
    const { nextSection, currentSection } = this.currentChapter;

    if (currentSection != null) {
      currentSection.completed = true;
    }

    if (nextSection == null) {
      const nextChapter = this.getNextChapter(this.currentChapter);

      if (nextChapter == null) {
        return false;
      }

      this.activateChapter(nextChapter);
      return this.readOn();
    }

    nextSection.reached = true;
    return true;
  }
}

export default Tutorial;
