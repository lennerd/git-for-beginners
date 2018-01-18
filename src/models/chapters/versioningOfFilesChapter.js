import { createChapter, init } from "../Chapter";
import { ChapterText, ChapterTask } from "../ChapterSection";
import { createAction } from "../Action";
import ConsoleCommand from "../ConsoleCommand";
import Visualisation from '../Visualisation';
import VisualisationFile, { createModifications } from "../VisualisationFile";
import { STATUS_MODIFIED, STATUS_DELETED } from "../../constants";
import VisualisationArea from '../VisualisationArea';
import Console from "../Console";
import React, { Fragment } from "react";

const addVersionDatabase = createAction('ADD_VERSION_DATABASE');
const restoreFile = createAction('RESTORE_FILE');
const modifyFile = createAction('MODIFY_FILE', fileIndex => {
  const { insertions, deletions } = createModifications();

  return {
    fileIndex,
    insertions,
    deletions,
  };
});
const addFile = createAction('ADD_FILE');
const copyFile = createAction('COPY_FILE');
const deleteFile = createAction('DELETE_FILE');

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

const versioningOfFilesChapter = createChapter('Versioning of Files', {
  get sections() {
    return [
      new ChapterText(() => 'So let’s start by asking: what is a version?', { skip: true }),
      new ChapterTask(() => 'Create a new file.', this.hasFiles),
      new ChapterTask(() => 'Modify the new file.', this.hasModifiedFiles, { tip: 'Select the new file to see more available options.', }),
      new ChapterTask(() => 'Make a copy of the file.', this.hasCopiedFile),
      new ChapterText(() => 'And there it is, a backup file, an older version of our file. As you can see, we can use filenames to distinguish between them.', { skip: true }),
      new ChapterTask(() => 'Create a few more backups.', this.hasBackups),
      new ChapterText(() => 'Do you see the problem? Data is lost easily. And the developer of this tutorial, like many people out there, was too lazy to come up with a good way of naming your files. Idiot.', { skip: true }),
      new ChapterTask(() => 'Add a storage.', this.hasVersionDatabase),
      new ChapterText(() => (
        <Fragment>
          Perfect. You added a version database, which stores and restores all the versions of our file, even when we accidentially deleted one.
        </Fragment>
      ), { skip: true }),
      new ChapterTask(() => 'Restore a file from the version database.', this.hasRestoredFiles),
      new ChapterText(() => 'You still there? Nice! Let’s finally start with the real thing.', { skip: true }),
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
    return this.vis.files.some(file => file.modified);
  },
  get hasVersionDatabase() {
    return this.vis.areas.includes(this.versionDatabase);
  },
  get activeFileIndex() {
    return this.vis.files.findIndex(file => file.active);
  },
  get activeFile() {
    return this.vis.files[this.activeFileIndex];
  },
  [init]() {
    this.vis = new Visualisation();
    this.versionDatabase = new VisualisationArea('Version Database');

    this.versionDatabase.column = 1;
    this.versionDatabase.height = 10;

    this.console = new Console()

    this.console.add(
      new ConsoleCommand('Version', {
        available: () => this.activeFile != null && this.hasVersionDatabase && this.activeFileIndex < (this.vis.files.length - 1),
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
        available: () => this.activeFile != null && (!this.hasVersionDatabase || this.activeFileIndex === (this.vis.files.length - 1)),
        commands: [
          new ConsoleCommand('Modify', {
            icon: '+-',
            message: () => 'File was changed.',
            action: modifyFile,
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('Backup', {
            icon: '↗',
            message: () => 'Version was created.',
            available: () => this.hasVersionDatabase,
            action: copyFile,
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('Copy', {
            icon: '↗',
            message: () => 'File was copied.',
            available: () => !this.hasVersionDatabase && this.activeFileIndex === (this.vis.files.length - 1),
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
        available: () => !this.vis.active && this.hasModifiedFiles && this.hasBackups && !this.hasVersionDatabase,
        message: () => 'A version database was added.',
        action: addVersionDatabase,
      }),
    );
  },
  [addFile]() {
    const file = new VisualisationFile();
    file.status = STATUS_MODIFIED;
    file.name = 'file';

    this.vis.add(file);
  },
  [modifyFile]({ fileIndex, insertions, deletions }) {
    const file = this.vis.files[fileIndex];

    file.insertions += insertions;
    file.deletions += deletions;
  },
  [copyFile](fileIndex) {
    const file = this.vis.files[fileIndex];

    const copy = file.copy();
    copy.visible = file.status !== STATUS_DELETED;

    let name = 'file';

    if (!this.hasVersionDatabase) {
      const nameIndex = (fileIndex) % FILE_NAME_VARIANTS.length;
      name += FILE_NAME_VARIANTS[nameIndex];
    }

    copy.name = name;

    if (fileIndex === (this.vis.files.length - 1)) {
      copy.reset();
    }

    this.vis.files.forEach((file, index) => {
      if (this.hasVersionDatabase) {
        file.row = this.vis.files.length - (index + 1);
        file.column = 1;
        file.visible = true;
        file.name = `Version ${index + 1}`;
      } else {
        file.column = this.vis.files.length - index;
      }
    });

    this.vis.add(copy);
  },
  [deleteFile](fileIndex) {
    const file = this.vis.files[fileIndex];
    file.status = STATUS_DELETED;
    file.reset();

    if (!this.hasVersionDatabase) {
      if (fileIndex === (this.vis.files.length - 1)) {
        this.vis.remove(file);

        this.vis.files.forEach((file, index) => {
          file.column = this.vis.files.length - (index + 1);
        });
      } else {
        file.visible = false;
      }
    }
  },
  [addVersionDatabase]() {
    this.vis.add(this.versionDatabase);

    this.vis.files.forEach((file, index) => {
      file.column = index < (this.vis.files.length - 1) ? 1 : 0;
      file.row = index < (this.vis.files.length - 1) ? this.vis.files.length - (index + 2) : 0;
      file.visible = true;
      file.name = index === (this.vis.files.length - 1) ? 'file' : `Version ${index + 1}`;
    });
  },
  [restoreFile](fileIndex) {
    const file = this.vis.files[fileIndex];
    const currentFile = this.vis.files[this.vis.files.length - 1];

    currentFile.insertions += file.insertions;
    currentFile.deletions += file.deletions;
    currentFile.status = file.status;
    currentFile.visible = file.status !== STATUS_DELETED;
  },
});

export default versioningOfFilesChapter;
