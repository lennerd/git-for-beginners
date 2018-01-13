import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Chapter, {
  ChapterMain,
} from './Chapter';
import { CHAPTER_VERSIONING_OF_FILES } from '../constants';
import ChapterHeader from './ChapterHeader';
import ChapterNext from './ChapterNext';
import ChapterBody from './ChapterBody';
import { TaskSection } from '../models/Section';

const SECTIONS = [
  new TaskSection('Create a new file.', () => false),
  new TaskSection('Create a new file.', () => true),
];

@observer
class VersioningOfFilesChapter extends Component {
  static chapter = CHAPTER_VERSIONING_OF_FILES;

  render() {
    const { index, chapter, tutorial } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader index={index} tutorial={tutorial} chapter={chapter} />
          <ChapterBody chapter={chapter} sections={SECTIONS} />
        </ChapterMain>
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default VersioningOfFilesChapter;

