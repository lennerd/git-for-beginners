import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Chapter, {
  ChapterMain,
} from './Chapter';
import { CHAPTER_VERSIONING_OF_FILES, STATUS_MODIFIED, STATUS_DELETED } from '../constants';
import ChapterHeader from './ChapterHeader';
import ChapterNext from './ChapterNext';
import ChapterBody from './ChapterBody';
import { ChapterTask, ChapterText } from '../models/ChapterSection';
import ConsoleCommand from '../models/ConsoleCommand';
import ChapterConsole from './ChapterConsole';
import VisualisationFileModel from '../models/VisualisationFile';
import Visualisation from './Visualisation';
import VisualisationFile from './VisualisationFile';
import VisualisationFileName from './VisualisationFileName';
import VisualisationFileStatus from './VisualisationFileStatus';
import VisualisationArea from './VisualisationArea';
import VisualisationAreaName from './VisualisationAreaName';

const SECTIONS = [
  new ChapterText('So let’s start by asking: what is a version?', { skip: true }),
  new ChapterTask('Create a new file.', (chapter) => chapter.vis.files.length > 0),
  new ChapterTask('Modify the new file.', (chapter) => chapter.vis.hasModifiedFiles, {
    tip: 'Select the new file to see more available options.',
  }),
  new ChapterTask('Make a copy of the file.', (chapter) => chapter.vis.files.length > 1),
  new ChapterText('And there it is, a backup file, an older version of our file. As you can see, we can use filenames to distinguish between them.', { skip: true }),
  new ChapterTask('Create a few more backups.', (chapter) => chapter.vis.files.length > 3),
  new ChapterText('Do you see the problem? Data is lost easily. And the developer of this tutorial, like many people out there, was too lazy to come up with a good way of naming your files. Idiot.', { skip: true }),
  new ChapterText('A version database might help here.', { skip: true }),
  new ChapterTask('Add a version database.', (chapter) => chapter.state.get('versionDatabase')),
];

const COMMANDS = [
  new ConsoleCommand('Add new file.', {
    icon: '+',
    test: chapter => chapter.vis.files.length === 0,
    message: 'A new file was created.',
    run(chapter) {
      const file = new VisualisationFileModel();
      file.status = STATUS_MODIFIED;

      chapter.vis.addFile(file);
    }
  }),
  new ConsoleCommand('File', {
    test: chapter => chapter.vis.activeFile != null,
    commands: [
      new ConsoleCommand('Modify', {
        icon: '+-',
        message: 'File was modified.',
        run: chapter => chapter.vis.activeFile.modify(),
      }),
      new ConsoleCommand('Copy', {
        icon: '↗',
        message: 'File was copied.',
        run(chapter) {
          const copy = chapter.vis.activeFile.copy();
          copy.status = STATUS_MODIFIED;

          chapter.vis.addFile(copy);
          chapter.vis.deactivateAll();
        },
      }),
      new ConsoleCommand('Delete', {
        icon: '×',
        message: 'File was deleted.',
        run(chapter) {
          chapter.vis.activeFile.status = STATUS_DELETED;
        },
      }),
    ],
  }),
  new ConsoleCommand('Add version database.', {
    icon: '+',
    test: chapter => chapter.vis.files.length > 3 && !chapter.state.get('versionDatabase'),
    message: 'A version database was added.',
    run: chapter => chapter.state.set('versionDatabase', true),
  }),
];

const FILE_NAME_VARIANTS = [
  '_final',
  '_final_final',
  '_final_v2_final',
  '_final_forreal',
  '_finaaal',
  '_finalalal',
  '_final_hahaha',
  '_final_ineedhelp',
  '_final_itsatrap',
];


@observer
class VersioningOfFilesChapter extends Component {
  static chapter = CHAPTER_VERSIONING_OF_FILES;

  renderVisualisation() {
    const { chapter, fontRegular, fontBlack, fontRegularCaps } = this.props;
    const useVersionDatabase = chapter.state.get('versionDatabase');

    return (
      <Visualisation vis={chapter.vis}>
        {chapter.vis.files.map((file, index) => {
          if (file.status === STATUS_DELETED) {
            return null;
          }

          let name = 'file';
          let column = chapter.vis.files.length - index - 1;
          let row = 0;

          if (useVersionDatabase) {
            if (index < (chapter.vis.files.length - 1)) {
              name = `Version ${index + 1}`;

              column = 1;
              row = chapter.vis.files.length - index - 2;
            }
          } else {
            if (index > 0) {
              const nameIndex = (index - 1) % FILE_NAME_VARIANTS.length;
              name += FILE_NAME_VARIANTS[nameIndex];
            }
          }

          return (
            <VisualisationFile
              key={file.id}
              column={column}
              row={row}
              vis={chapter.vis}
              file={file}
            >
              <VisualisationFileName
                font={fontRegular}
                name={name}
              />
              <VisualisationFileStatus font={fontBlack} file={file} />
            </VisualisationFile>
          );
        })}
        {useVersionDatabase && <VisualisationArea column={1} height={10}>
          <VisualisationAreaName font={fontRegularCaps} name="Version database" />
        </VisualisationArea>}
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
        <ChapterConsole chapter={chapter} commands={COMMANDS} />
        {this.renderVisualisation()}
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default VersioningOfFilesChapter;

