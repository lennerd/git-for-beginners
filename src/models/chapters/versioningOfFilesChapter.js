import { createChapter, init } from '../Chapter';
import { ChapterText, ChapterTask } from '../ChapterSection';
import { createAction } from '../Action';
import ConsoleCommand from '../ConsoleCommand';
import Console from '../Console';
import React, { Fragment } from 'react';
import VersionDatabaseVisualisation from '../vis/VersionDatabaseVisualisation';
import chance from '../chance';

const addVersionDatabase = createAction('ADD_VERSION_DATABASE');
const restoreFile = createAction('RESTORE_FILE');
const modifyFile = createAction('MODIFY_FILE', ({ fileIndex, diff }) => {
  return {
    fileIndex,
    diff: chance.diff(diff),
  };
});
const addFile = createAction('ADD_FILE');
const copyFile = createAction('COPY_FILE');
const deleteFile = createAction('DELETE_FILE');

const versioningOfFilesChapter = createChapter('Versioning of Files', {
  get sections() {
    return [
      new ChapterText(() => 'So let’s start by asking: what is a version?', {
        skip: true,
      }),
      new ChapterTask(() => 'Create a new file.', this.hasFiles),
      new ChapterTask(() => 'Modify the new file.', this.hasModifiedFiles, {
        tip: () => 'Select the new file to see more available options.',
      }),
      new ChapterTask(() => 'Make a copy of the file.', this.hasCopiedFile),
      new ChapterText(
        () =>
          'And there it is, a backup file, an older version of our file. As you can see, we can use filenames to distinguish between them.',
        { skip: true },
      ),
      new ChapterTask(() => 'Create a few more backups.', this.hasBackups),
      new ChapterText(
        () =>
          'Do you see the problem? Data is lost easily. And the developer of this tutorial, like many people out there, was too lazy to come up with a good way of naming your files. Idiot.',
        { skip: true },
      ),
      new ChapterTask(() => 'Add a version database.', this.hasVersionDatabase),
      new ChapterText(
        () => (
          <Fragment>
            Perfect. You added a version database, which stores and restores all
            the versions of our file, even when we accidentially deleted one.
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => 'Restore a file from the version database.',
        this.hasRestoredFiles,
      ),
      new ChapterText(
        () => 'You still there? Nice! Let’s finally start with the real thing.',
        { skip: true },
      ),
    ];
  },
  get hasFiles() {
    return this.vis.files.length > 0;
  },
  get hasCopiedFile() {
    return this.vis.files.length > 1;
  },
  get hasBackups() {
    return this.vis.files.length > 3;
  },
  get hasRestoredFiles() {
    return this.state.has(restoreFile);
  },
  get hasModifiedFiles() {
    return this.state.has(modifyFile);
  },
  get hasVersionDatabase() {
    return this.vis.useVersionDatabase;
  },
  get activeFileIndex() {
    return this.vis.files.findIndex(file => file.active);
  },
  get activeFile() {
    return this.vis.files[this.activeFileIndex];
  },
  [init]() {
    this.vis = new VersionDatabaseVisualisation();

    this.console = new Console();

    this.console.add(
      new ConsoleCommand('Version', {
        available: () => {
          return (
            this.activeFile != null &&
            this.hasVersionDatabase &&
            this.activeFileIndex > 0
          );
        },
        commands: [
          new ConsoleCommand('Restore', {
            icon: '↙',
            message: () => 'Version was was restored.',
            action: restoreFile,
            payloadCreator: () => this.activeFileIndex,
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: () =>
          this.activeFile != null &&
          (!this.hasVersionDatabase || this.activeFileIndex === 0),
        commands: [
          new ConsoleCommand('Modify', {
            icon: '+-',
            message: () => 'File was changed.',
            action: modifyFile,
            payloadCreator: () => ({
              fileIndex: this.activeFileIndex,
              diff: this.activeFile.diff,
            }),
          }),
          new ConsoleCommand('Backup', {
            icon: '↗',
            message: () => 'Version was created.',
            available: () => this.hasVersionDatabase,
            action: copyFile,
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('Save & Copy', {
            icon: '↗',
            message: () => 'File was copied.',
            available: () =>
              !this.hasVersionDatabase && this.activeFileIndex === 0,
            action: copyFile,
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('Delete', {
            icon: '×',
            message: () => 'File was deleted.',
            action: deleteFile,
            payloadCreator: () => this.activeFileIndex,
          }),
        ],
      }),
      new ConsoleCommand('Add new file.', {
        icon: '+',
        available: () => !this.hasFiles,
        message: () => 'A new file was created.',
        action: addFile,
      }),
      new ConsoleCommand('Add version database.', {
        icon: '+',
        available: () =>
          this.hasModifiedFiles && this.hasBackups && !this.hasVersionDatabase,
        message: () => 'A version database was added.',
        action: addVersionDatabase,
      }),
    );
  },
  [addFile]() {
    this.vis.addFile();
  },
  [modifyFile]({ fileIndex, diff }) {
    this.vis.modifyFile(fileIndex, diff);
  },
  [copyFile](fileIndex) {
    this.vis.copyFile(fileIndex);
  },
  [deleteFile](fileIndex) {
    this.vis.deleteFile(fileIndex);
  },
  [addVersionDatabase]() {
    this.vis.useVersionDatabase = true;
  },
  [restoreFile](fileIndex) {
    this.vis.restoreFile(fileIndex);
  },
});

export default versioningOfFilesChapter;
