import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import Chapter, {
  ChapterMain,
} from './Chapter';
import { CHAPTER_VERSIONING_OF_FILES } from '../constants';
import ChapterHeader from './ChapterHeader';
import ChapterNext from './ChapterNext';
import ChapterBody from './ChapterBody';
import { Task, Text } from '../models/Section';
import ChapterConsole from './ChapterConsole';
import { ConsoleCommand, ConsoleSection, ConsoleIcon, ConsoleMessage, ConsoleTitle, ConsoleLog, ConsoleLabel, ConsoleCommandList } from './Console';
import File from '../models/File';
import Visualisation from './Visualisation';
import VisualisationFile from './VisualisationFile';

const SECTIONS = [
  new Text('So let’s start by asking: what is a version?', { skip: true }),
  new Task('Create a new file.', (chapter) => chapter.vis.files.length > 0),
  new Task('Modify the new file.', (chapter) => chapter.vis.hasModifiedFiles, {
    tip: 'Select the new file to see more available options.',
  }),
  new Task('Make a copy of the file.', (chapter) => chapter.vis.files.length > 1),
  new Text('And there it is, a backup file, an older version of our file. As you can see, we can use filenames to distinguish between them.', { skip: true }),
];

@observer
class VersioningOfFilesChapter extends Component {
  static chapter = CHAPTER_VERSIONING_OF_FILES;

  @action.bound addFile() {
    const { chapter } = this.props;

    if (chapter.vis.files.length > 0) {
      throw new Error('There is already a file.');
    }

    chapter.vis.files.push(new File());
  }

  @action.bound modifyFile() {
    const { chapter } = this.props;

    if (chapter.vis.activeFile == null) {
      throw new Error('No active file to modify.');
    }

    chapter.vis.activeFile.modify();
  }

  renderConsole() {
    const { chapter } = this.props;

    let command = (
      <ConsoleSection>
        <ConsoleMessage>No file is selected.</ConsoleMessage>
      </ConsoleSection>
    );
    let history;

    if (chapter.vis.files.length === 0) {
      command = (
        <ConsoleSection>
          <ConsoleCommand onClick={this.addFile}>
            <ConsoleIcon>+</ConsoleIcon> Add new file.
          </ConsoleCommand>
        </ConsoleSection>
      );
    } else if (chapter.vis.files.some(file => file.active)) {
      command = (
        <ConsoleSection>
          <ConsoleLabel>File</ConsoleLabel>
          <ConsoleCommandList>
            <ConsoleCommand onClick={this.modifyFile}>
              <ConsoleIcon>+-</ConsoleIcon> Modify
            </ConsoleCommand>
            <ConsoleCommand onClick={this.deleteFile}>
              <ConsoleIcon offset="1">×</ConsoleIcon> Delete
            </ConsoleCommand>
            <ConsoleCommand onClick={this.copyFile}>
              <ConsoleIcon offset="1">↗</ConsoleIcon> Copy
            </ConsoleCommand>
          </ConsoleCommandList>
        </ConsoleSection>
      );
    }

    if (chapter.vis.files.length > 0) {
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
        {command}
      </ChapterConsole>
    );
  }

  renderVisualisation() {
    const { chapter } = this.props;

    let file;

    if (chapter.vis.files.length === 1) {
      file = <VisualisationFile vis={chapter.vis} file={chapter.vis.files[0]} />;
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

