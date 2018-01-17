import { createChapter, init } from "./Chapter";
import { ChapterText, ChapterTask } from "./ChapterSection";
import { createAction } from "./Action";
import ConsoleCommand from "./ConsoleCommand";
import Visualisation from './Visualisation';
import VisualisationFile from "./VisualisationFile";
import { STATUS_MODIFIED, STATUS_DELETED } from "../constants";
import VisualisationArea from './VisualisationArea';

const addVersionDatabase = createAction('ADD_VERSION_DATABASE');
const restoreFile = createAction('RESTORE_FILE');
const modifyFile = createAction('MODIFY_FILE', fileIndex => {
  const change = Math.round(Math.random() * 2);
  let insertions = 0;
  let deletions = 0;

  if (change === 0 || change === 1) {
    insertions += 1 + Math.round(Math.random() * 19);
  }

  if (change === 0 || change === 2) {
    deletions += 1 + Math.round(Math.random() * 19);
  }

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
      new ChapterText(() => 'A version database might help here.', { skip: true }),
      new ChapterTask(() => 'Add a version database.', this.hasVersionDatabase),
      new ChapterTask(() => 'Restore a file.', this.hasRestoredFiles),
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
  /*get vis() {
    const vis = new Visualisation();

    const versionDatabase = new VisualisationArea();
    versionDatabase.name = 'Version Database';
    versionDatabase.column = 1;
    versionDatabase.height = 10;

    extendObservable(vis, {
      files: computed(() => {
        const files = [];

        this.handleActions({
          [addFile]() {
            const file = new VisualisationFile();
            file.status = STATUS_MODIFIED;

            files.push(file);
          },
          [modifyFile]({ fileIndex, insertions, deletions }) {
            files[fileIndex].insertions += insertions;
            files[fileIndex].deletions += deletions;
          },
          [copyFile](fileIndex) {
            const copy = files[fileIndex].copy();

            files.splice(fileIndex + 1, 0, copy);
          },
          [deleteFile](fileIndex) {
            const activeFile = files[fileIndex];
            const lastFile = files[files.length - 1];

            if (!this.hasVersionDatabase && activeFile === lastFile) {
              files.splice(fileIndex, 1);
            } else {
              activeFile.status = STATUS_DELETED;
            }
          },
          [backupFile](fileIndex) {
            const copy = files[fileIndex].copy();
            copy.reset();

            files.splice(fileIndex + 1, 0, copy);
          },
          [restoreFile](fileIndex) {
            const activeFile = files[fileIndex];
            const lastFile = files[files.length - 1];

            lastFile.insertions += activeFile.insertions;
            lastFile.deletions += activeFile.deletions;
            lastFile.status = activeFile.status;
          },
        });

        files.forEach((file, index) => {
          let name = 'file';
          let column = files.length - index - 1;
          let row = 0;

          if (this.hasVersionDatabase) {
            if (index < (files.length - 1)) {
              name = `Version ${index + 1}`;

              column = 1;
              row = files.length - index - 2;
            }
          } else {
            if (index > 0) {
              const nameIndex = (index - 1) % FILE_NAME_VARIANTS.length;
              name += FILE_NAME_VARIANTS[nameIndex];
            }
          }

          file.column = column;
          file.row = row;
          file.name = name;
          file.visible = this.hasVersionDatabase || file.status !== STATUS_DELETED;
        });

        return files;
      }),

      areas: computed(() => {
        const areas = [];

        if (this.hasVersionDatabase) {
          areas.push(versionDatabase);
        }

        return areas;
      }),
    });

    return vis;
  },*/
  get commands() {
    return [
      new ConsoleCommand('Version', {
        available: this.activeFile != null && this.hasVersionDatabase && this.activeFileIndex < (this.vis.files.length - 1),
        commands: [
          new ConsoleCommand('Restore', {
            icon: '↙',
            message: 'Version was was restored.',
            run: () => this.dispatch(restoreFile(this.activeFileIndex)),
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: this.activeFile != null,
        commands: [
          new ConsoleCommand('Modify', {
            icon: '+-',
            message: 'File was changed.',
            run: () => this.dispatch(modifyFile(this.activeFileIndex)),
          }),
          new ConsoleCommand('Backup', {
            icon: '↗',
            message: 'Version was created.',
            available: this.hasVersionDatabase,
            run: () => this.dispatch(copyFile(this.activeFileIndex)),
          }),
          new ConsoleCommand('Copy', {
            icon: '↗',
            message: 'File was copied.',
            available: !this.hasVersionDatabase && this.activeFileIndex === (this.vis.files.length - 1),
            run: () => this.dispatch(copyFile(this.activeFileIndex)),
          }),
          new ConsoleCommand('Delete', {
            icon: '×',
            message: 'File was deleted.',
            run: () => this.dispatch(deleteFile(this.activeFileIndex)),
          }),
        ],
      }),
      new ConsoleCommand('Add new file.', {
        icon: '+',
        available: !this.hasFiles,
        message: 'A new file was created.',
        run: () => this.dispatch(addFile()),
      }),
      new ConsoleCommand('Add version database.', {
        icon: '+',
        available: this.hasModifiedFiles && this.hasBackups && !this.hasVersionDatabase,
        message: 'A version database was added.',
        run: () => this.dispatch(addVersionDatabase()),
      }),
    ];
  },
});

export default versioningOfFilesChapter;
