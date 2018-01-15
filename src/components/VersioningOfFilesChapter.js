import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';

import { STATUS_MODIFIED, STATUS_DELETED } from '../constants';
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
import TutorialChapter from './TutorialChapter';

const SECTIONS = [
  new ChapterText('So let’s start by asking: what is a version?', { skip: true }),
  new ChapterTask('Create a new file.', (chapter) => chapter.hasAddedFile),
  new ChapterTask('Modify the new file.', (chapter) => chapter.hasModifiedFiles, { tip: 'Select the new file to see more available options.', }),
  new ChapterTask('Make a copy of the file.', (chapter) => chapter.hasCopiedFile),
  new ChapterText('And there it is, a backup file, an older version of our file. As you can see, we can use filenames to distinguish between them.', { skip: true }),
  new ChapterTask('Create a few more backups.', (chapter) => chapter.hasBackups),
  new ChapterText('Do you see the problem? Data is lost easily. And the developer of this tutorial, like many people out there, was too lazy to come up with a good way of naming your files. Idiot.', { skip: true }),
  new ChapterText('A version database might help here.', { skip: true }),
  new ChapterTask('Add a version database.', (chapter) => chapter.hasVersionDatabase),
  new ChapterTask('Restore a file.', (chapter) => chapter.hasRestoredFiles),
];

const COMMANDS = [
  new ConsoleCommand('Version', {
    test: chapter => chapter.activeFileVersion != null,
    commands: [
      new ConsoleCommand('Restore', {
        icon: '↙',
        message: 'Version was was restored.',
        run(chapter) {
          chapter.vis.lastFile.insertions += chapter.vis.activeFile.insertions;
          chapter.vis.lastFile.deletions += chapter.vis.activeFile.deletions;
          chapter.vis.lastFile.status = chapter.vis.activeFile.status;
          chapter.vis.lastFile.restored = true;
          chapter.hasRestoredFiles = true;
          chapter.vis.deactivateAll();
          chapter.completed = true;
        }
      }),
    ],
  }),
  new ConsoleCommand('File', {
    test: chapter => chapter.vis.activeFile != null,
    commands: [
      new ConsoleCommand('Modify', {
        icon: '+-',
        message: 'File was changed.',
        run: chapter => chapter.vis.activeFile.modify(),
      }),
      new ConsoleCommand('Backup', {
        icon: '↗',
        message: 'Version was created.',
        test: chapter => chapter.hasVersionDatabase,
        run(chapter) {
          const copy = chapter.vis.activeFile.copy();
          copy.status = chapter.vis.activeFile.status;

          chapter.vis.addFile(copy);
          chapter.vis.deactivateAll();
        },
      }),
      new ConsoleCommand('Copy', {
        icon: '↗',
        message: 'File was copied.',
        test: chapter => !chapter.hasVersionDatabase,
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
          if (!chapter.hasVersionDatabase && chapter.vis.activeFile === chapter.vis.lastFile) {
            chapter.vis.files.remove(chapter.vis.activeFile);

            return;
          }

          chapter.vis.activeFile.status = STATUS_DELETED;
        },
      }),
    ],
  }),
  new ConsoleCommand('Add new file.', {
    icon: '+',
    test: chapter => (
      chapter.vis.files.length === 0
    ),
    message: 'A new file was created.',
    run(chapter) {
      const file = new VisualisationFileModel();
      file.status = STATUS_MODIFIED;

      chapter.vis.addFile(file);
    }
  }),
  new ConsoleCommand('Add version database.', {
    icon: '+',
    test: chapter => chapter.hasModifiedFiles && chapter.hasBackups && !chapter.hasVersionDatabase,
    message: 'A version database was added.',
    run: chapter => chapter.hasVersionDatabase = true,
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
  constructor(props) {
    super();

    const { chapter } = props;

    extendObservable(chapter, {
      get hasVersionDatabase() {
        return this.state.get('versionDatabase');
      },
      set hasVersionDatabase(hasVersionDatabase) {
        this.state.set('versionDatabase', hasVersionDatabase);
      },
      get hasRestoredFiles() {
        return this.state.get('restoredFiles');
      },
      set hasRestoredFiles(hasRestoredFiles) {
        this.state.set('restoredFiles', hasRestoredFiles);
      },
      get hasModifiedFiles() {
        return this.vis.files.some(file => file.modified);
      },
      get activeFileVersion() {
        if (
          !this.hasVersionDatabase ||
          this.vis.activeFile == null ||
          this.vis.files[this.vis.files.length - 1] === this.vis.activeFile
        ) {
          return null;
        }

        return this.vis.activeFile;
      },
      get hasAddedFile() {
        return this.vis.files.length > 0;
      },
      get hasCopiedFile() {
        return this.vis.files.length > 1;
      },
      get hasBackups() {
        return this.vis.files.length > 3;
      }
    });
  }

  renderVisualisation() {
    const { chapter, fontRegular, fontBlack, fontRegularCaps } = this.props;

    return (
      <Visualisation vis={chapter.vis}>
        {chapter.vis.files.map((file, index) => {
          if (
            file.status === STATUS_DELETED &&
            !chapter.hasVersionDatabase
          ) {
            return null;
          }

          let name = 'file';
          let column = chapter.vis.files.length - index - 1;
          let row = 0;

          if (chapter.hasVersionDatabase) {
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
        {chapter.hasVersionDatabase && <VisualisationArea column={1} height={10}>
          <VisualisationAreaName font={fontRegularCaps} name="Version database" />
        </VisualisationArea>}
      </Visualisation>
    );
  }

  render() {
    const { chapter, tutorial } = this.props;

    return (
      <TutorialChapter chapter={chapter} tutorial={tutorial} sections={SECTIONS}>
        <ChapterConsole chapter={chapter} commands={COMMANDS} />
        {this.renderVisualisation()}
      </TutorialChapter>
    );
  }
}

export default VersioningOfFilesChapter;

