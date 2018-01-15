import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import Chapter, { ChapterMain } from './Chapter';
import ChapterHeader from './ChapterHeader';
import ChapterBody from './ChapterBody';
import ChapterNext from './ChapterNext';
import { SECTION_TEXT, SECTION_TASK } from '../constants';

@observer
class TutorialChapter extends Component {
  @computed get visibleSections() {
    const { sections, chapter } = this.props;

    let amountOfVisibleTextSections = chapter.visibleTextSections;
    let prevTaskSectionDone = true;

    return takeWhile(sections, (section) => {
      if (section.is(SECTION_TEXT)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        if (section.skip) {
          return true;
        }

        if (amountOfVisibleTextSections === 0) {
          return false;
        }

        amountOfVisibleTextSections--;

        return true;
      }

      if (section.is(SECTION_TASK)) {
        if (!prevTaskSectionDone) {
          return false;
        }

        prevTaskSectionDone = section.optional || section.done;

        return true;
      }

      throw new Error('Unknown section type.');
    });
  }

  @computed get doableSections() {
    const { sections } = this.props;

    return sections.filter((section) => {
      if (section.is(SECTION_TEXT)) {
        return !section.skip;
      }

      return true;
    });
  }

  @computed get doneSections() {
    return this.visibleSections.filter((section) => {
      if (section.is(SECTION_TEXT)) {
        return !section.skip;
      }

      return section.optional || section.done;
    });
  }

  componentDidUpdate() {
    this.updateProgress();
  }

  @action updateProgress() {
    const { chapter } = this.props;
    const progress = this.doneSections.length / this.doableSections.length;

    chapter.progress = progress;

    if (progress >= 1) {
      chapter.completed = true;
    }
  }

  @action.bound readOn() {
    const { chapter } = this.props;

    chapter.visibleTextSections++;
  }

  render() {
    const { chapter, tutorial, children } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader tutorial={tutorial} chapter={chapter} />
          <ChapterBody
            chapter={chapter}
            sections={this.visibleSections}
            onReadOn={this.readOn}
          />
        </ChapterMain>
        {children}
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default TutorialChapter;
