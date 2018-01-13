import React, { Component } from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';

import Chapter, {
  ChapterMain,
} from './Chapter';
import { CHAPTER_VERSIONING_OF_FILES } from '../constants';
import ChapterHeader from './ChapterHeader';
import ChapterNext from './ChapterNext';
import ChapterBody from './ChapterBody';
import { TaskSection, TextSection } from '../models/Section';
import ChapterConsole from './ChapterConsole';
import { ConsoleCommand, ConsoleSection, ConsoleIcon, ConsoleMessage, ConsoleTitle, ConsoleLog } from './Console';

const SECTIONS = [
  new TextSection('So let’s start by asking: what is a version?', true),
  new TaskSection('Create a new file.', (state) => {
    const files = state.get('files');

    return files && files.length > 0;
  }),
];

@observer
class VersioningOfFilesChapter extends Component {
  static chapter = CHAPTER_VERSIONING_OF_FILES;

  @action.bound addFile() {
    const { chapter } = this.props;

    let files = chapter.state.get('files');

    if (files != null && files.length > 0) {
      return;
    }

    if (files == null) {
      files = [];
    }

    files.push('test');
    chapter.state.set('files', files);
  }

  renderConsole() {
    const { chapter } = this.props;

    const files = chapter.state.get('files');
    let command = <ConsoleMessage>No file is selected.</ConsoleMessage>;
    let history;

    if (files == null || files.length === 0) {
      command = (
        <ConsoleCommand onClick={this.addFile}>
          <ConsoleIcon>+</ConsoleIcon> Add new file.
        </ConsoleCommand>
      );
    } else {
      history = (
        <ConsoleSection>
          <ConsoleLog>
            <ConsoleTitle>
              <ConsoleIcon>+</ConsoleIcon> Add new file.
            </ConsoleTitle>
            <ConsoleMessage>
              A new file was created.
            </ConsoleMessage>
          </ConsoleLog>
        </ConsoleSection>
      );
    }

    return (
      <ChapterConsole>
        {history}
        <ConsoleSection>
          {command}
        </ConsoleSection>
      </ChapterConsole>
    );
  }

  render() {
    const { index, chapter, tutorial } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader index={index} tutorial={tutorial} chapter={chapter} />
          <ChapterBody chapter={chapter} sections={SECTIONS} />
        </ChapterMain>
        {this.renderConsole()}
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default VersioningOfFilesChapter;

