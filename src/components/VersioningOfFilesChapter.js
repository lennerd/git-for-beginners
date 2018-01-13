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
import File from '../models/File';
import Visualisation from './Visualisation';
import VisualisationFile from './VisualisationFile';

const SECTIONS = [
  new TextSection('So let’s start by asking: what is a version?', true),
  new TaskSection('Create a new file.', (chapter) => {
    return chapter.vis.files.length > 0;
  }),
];

@observer
class VersioningOfFilesChapter extends Component {
  static chapter = CHAPTER_VERSIONING_OF_FILES;

  @action.bound addFile() {
    const { chapter } = this.props;

    if (chapter.vis.files.length > 0) {
      return;
    }

    chapter.vis.files.push(new File());
  }

  renderConsole() {
    const { chapter } = this.props;

    let command = <ConsoleMessage>No file is selected.</ConsoleMessage>;
    let history;

    if (chapter.vis.files.length === 0) {
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

  renderVisualisation() {
    const { chapter } = this.props;

    let file;

    if (chapter.vis.files.length === 1) {
      file = <VisualisationFile file={chapter.vis.files[0]} />;
    }

    return (
      <Visualisation vis={chapter.vis}>
        {file}
      </Visualisation>
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
        {this.renderVisualisation()}
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default VersioningOfFilesChapter;

