import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';

import Chapter, {
  ChapterMain,
  ChapterNext,
  ChapterBody,
  ChapterText,
  ChapterReadOn
} from './Chapter';
import { CHAPTER_INTRODUCTION } from '../constants';
import ChapterHeader from './ChapterHeader';

const SECTIONS = [
  'Over the passed decades computer in different shape and sizes changed our daily life enormously. Together we create huge amount of data in form of files everyday to store everything from invoices to love letters, from code to illustrations and designs.',
  <Fragment>
    To prevent data loss we create backups and use clouds to store files and share data with others. Two people working on the same file is often impossible though. And after all, data is lost, because we accidentily deleted an old file or have overwritten a file a college had changed a few minutes before. <strong>No matter how hard we work on file name conventions and how many channels we use to communicate in our team, mistakes are made.</strong>
  </Fragment>,
  'But not everything is lost (pun intended). Special version control systems can help to store versions of our project more effectily and give our team a better way of working on files together.',
  <strong>Welcome to “Git for Beginners” – an interactive tutorial to learn and understand Git, a popular version control system to help you and your team to not loose data again.</strong>,
  'But let’s start by taking a look at …',
];

@observer
class IntroductionChapter extends Component {
  static chapter = CHAPTER_INTRODUCTION;

  @computed get sections() {
    const { chapter } = this.props;

    return SECTIONS.slice(0, chapter.state.visibleSections);
  }

  @action.bound readOn() {
    const { chapter } = this.props;
    const visibleSections = chapter.state.visibleSections + 1;

    if (visibleSections === SECTIONS.length) {
      chapter.completed = true;
    }

    chapter.progress = this.sections.length / SECTIONS.length;
    chapter.state.visibleSections = visibleSections;
  }

  @action.bound turnOver() {
    const { tutorial } = this.props;

    tutorial.currentChapter.progress = 1;
    tutorial.turnOver();
  }

  render() {
    const { index, chapter, tutorial } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader
            index={index}
            of={tutorial.chapters.length}
            chapter={chapter}
          />
          <ChapterBody>
            {this.sections.map(section => (
              <ChapterText>
                {section}
              </ChapterText>
            ))}
            {
              !chapter.completed &&
              <ChapterReadOn onClick={this.readOn}>Read On</ChapterReadOn>
            }
          </ChapterBody>
        </ChapterMain>
        {
          chapter.completed && tutorial.nextChapter &&
          <ChapterNext onClick={this.turnOver}>
            {tutorial.nextChapter.title}
          </ChapterNext>
        }
      </Chapter>
    );
  }
}

export default IntroductionChapter;

