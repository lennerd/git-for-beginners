import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';

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
  @computed get hasVersionDatabase() {
    const { chapter } = this.props;

    // return chapter.hasAction(ACTION_ADD_VERSION_DATABSE);

    return chapter.state.get('versionDatabase');
  }

  set hasVersionDatabase(hasVersionDatabase) {
    const { chapter } = this.props;

    chapter.state.set('versionDatabase', hasVersionDatabase);
  }

  @computed get hasRestoredFiles() {
    const { chapter } = this.props;

    // return chapter.hasAction(ACTION_RESTORE_FILE);

    return chapter.state.get('restoredFiles');
  }

  set hasRestoredFiles(hasRestoredFiles) {
    const { chapter } = this.props;

    chapter.state.set('restoredFiles', hasRestoredFiles);
  }

  @computed get hasModifiedFiles() {
    const { chapter } = this.props;

    // return chapter.hasAction(ACTION_MODIFY_FILE);

    return chapter.vis.files.some(file => file.modified);
  }

  @computed get activeFileVersion() {
    const { chapter } = this.props;

    if (
      !this.hasVersionDatabase ||
      chapter.vis.activeFile == null ||
      chapter.vis.files[chapter.vis.files.length - 1] === chapter.vis.activeFile
    ) {
      return null;
    }

    return chapter.vis.activeFile;
  }

  @computed get hasAddedFile() {
    const { chapter } = this.props;

    // return chapter.hasAction(ACTION_ADD_FILE);

    return chapter.vis.files.length > 0;
  }

  @computed get hasCopiedFile() {
    const { chapter } = this.props;

    // return chapter.hasAction(ACTION_COPY_FILE);

    return chapter.vis.files.length > 1;
  }

  @computed get hasBackups() {
    const { chapter } = this.props;

    // return chapter.actions.filter(action => ACTION_COPY_FILE).length > 3;

    return chapter.vis.files.length > 3;
  }

  @action.bound restoreFile() {
    const { chapter } = this.props;

    chapter.vis.lastFile.insertions += chapter.vis.activeFile.insertions;
    chapter.vis.lastFile.deletions += chapter.vis.activeFile.deletions;
    chapter.vis.lastFile.status = chapter.vis.activeFile.status;
    chapter.vis.lastFile.restored = true;
    this.hasRestoredFiles = true;
    chapter.vis.deactivateAll();
    chapter.completed = true;

    //chapter.actions.push({ ACTION_RESTORE_FILE, payload: vis.activeFileIndex });
    //vis.dispatch({ ACTION_RESTORE_FILE, payload: vis.activeFileIndex });
  }

  @action.bound modifyFile() {
    const { chapter } = this.props;

    chapter.vis.activeFile.modify();

    //chapter.actions.push({ ACTION_MODIFY_FILE, payload: vis.activeFileIndex });
  }

  @action.bound copyFile() {
    const { chapter } = this.props;

    const copy = chapter.vis.activeFile.copy();
    copy.status = STATUS_MODIFIED;
    copy.reset();

    chapter.vis.addFile(copy);
    chapter.vis.deactivateAll();

    //chapter.actions.push({ ACTION_COPY_FILE, payload: vis.activeFileIndex });
  }

  @action.bound backupFile() {
    const { chapter } = this.props;

    const copy = chapter.vis.activeFile.copy();
    copy.status = chapter.vis.activeFile.status;

    chapter.vis.addFile(copy);
    chapter.vis.deactivateAll();

    //chapter.actions.push({ ACTION_BACKUP_FILE });
  }

  @action.bound deleteFile() {
    const { chapter } = this.props;

    if (!this.hasVersionDatabase && chapter.vis.activeFile === chapter.vis.lastFile) {
      chapter.vis.files.remove(chapter.vis.activeFile);

      return;
    }

    chapter.vis.activeFile.status = STATUS_DELETED;

    //chapter.actions.push({ ACTION_DELETE_FILE, payload: vis.activeFileIndex });
  }

  @action.bound addFile() {
    const { chapter } = this.props;

    const file = new VisualisationFileModel();
    file.status = STATUS_MODIFIED;

    chapter.vis.addFile(file);

    //chapter.actions.push({ ACTION_ADD_FILE });
  }

  @action.bound addVersionDatabase() {
    this.hasVersionDatabase = true;

    //chapter.actions.push({ ACTION_ADD_VERSION_DATABASE });
  }

  renderVisualisation() {
    const { chapter, fontRegular, fontBlack, fontRegularCaps } = this.props;

    const files = chapter.vis.files.map((file, index) => {
      if (
        file.status === STATUS_DELETED &&
        !this.hasVersionDatabase
      ) {
        return null;
      }

      let name = 'file';
      let column = chapter.vis.files.length - index - 1;
      let row = 0;

      if (this.hasVersionDatabase) {
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
    });

    return (
      <Visualisation vis={chapter.vis}>
        {files}
        {this.hasVersionDatabase && <VisualisationArea column={1} height={10}>
          <VisualisationAreaName font={fontRegularCaps} name="Version database" />
        </VisualisationArea>}
      </Visualisation>
    );
  }

  render() {
    const { chapter, tutorial } = this.props;

    const sections = [
      new ChapterText(() => 'So let’s start by asking: what is a version?', { skip: true }),
      new ChapterTask(() => 'Create a new file.', this.hasAddedFile),
      new ChapterTask(() => 'Modify the new file.', this.hasModifiedFiles, { tip: 'Select the new file to see more available options.', }),
      new ChapterTask(() => 'Make a copy of the file.', this.hasCopiedFile),
      new ChapterText(() => 'And there it is, a backup file, an older version of our file. As you can see, we can use filenames to distinguish between them.', { skip: true }),
      new ChapterTask(() => 'Create a few more backups.', this.hasBackups),
      new ChapterText(() => 'Do you see the problem? Data is lost easily. And the developer of this tutorial, like many people out there, was too lazy to come up with a good way of naming your files. Idiot.', { skip: true }),
      new ChapterText(() => 'A version database might help here.', { skip: true }),
      new ChapterTask(() => 'Add a version database.', this.hasVersionDatabase),
      new ChapterTask(() => 'Restore a file.', this.hasRestoredFiles),
    ];

    const commands = [
      new ConsoleCommand('Version', {
        available: this.activeFileVersion != null,
        commands: [
          new ConsoleCommand('Restore', {
            icon: '↙',
            message: 'Version was was restored.',
            run: this.restoreFile,
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: chapter.vis.activeFile != null,
        commands: [
          new ConsoleCommand('Modify', {
            icon: '+-',
            message: 'File was changed.',
            run: this.modifyFile,
          }),
          new ConsoleCommand('Backup', {
            icon: '↗',
            message: 'Version was created.',
            available: this.hasVersionDatabase,
            run: this.backupFile,
          }),
          new ConsoleCommand('Copy', {
            icon: '↗',
            message: 'File was copied.',
            available: !this.hasVersionDatabase,
            run: this.copyFile,
          }),
          new ConsoleCommand('Delete', {
            icon: '×',
            message: 'File was deleted.',
            run: this.deleteFile,
          }),
        ],
      }),
      new ConsoleCommand('Add new file.', {
        icon: '+',
        available: chapter.vis.files.length === 0,
        message: 'A new file was created.',
        run: this.addFile,
      }),
      new ConsoleCommand('Add version database.', {
        icon: '+',
        available: this.hasModifiedFiles && this.hasBackups && !this.hasVersionDatabase,
        message: 'A version database was added.',
        run: this.addVersionDatabase,
      }),
    ];

    return (
      <TutorialChapter chapter={chapter} tutorial={tutorial} sections={sections}>
        <ChapterConsole commands={commands} />
        {this.renderVisualisation()}
      </TutorialChapter>
    );
  }
}

export default VersioningOfFilesChapter;

