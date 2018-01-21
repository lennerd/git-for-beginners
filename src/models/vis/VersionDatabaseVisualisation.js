import { computed, observable, action } from "mobx";

import Visualisation from "./Visualisation";
import VisualisationArea from "./VisualisationArea";
import VisualisationFile from "./VisualisationFile";
import { STATUS_DELETED, STATUS_ADDED, STATUS_MODIFIED } from "../../constants";

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

class FileVisualisation extends VisualisationFile {
  @observable diff;
  @observable nameIndex;
  @observable status;

  constructor(vis, nameIndex, diff = { added: 0, removed: 0 }) {
    super();

    this.status = STATUS_ADDED;

    this.nameIndex = nameIndex;
    this.vis = vis;
    this.diff = diff;
  }

  getParent() {
    if (this.vis.useVersionDatabase && this.vis.files.indexOf(this) > 0) {
      return this.vis.versionDatabase;
    }

    return this.vis;
  }

  getChildren() {
    return [];
  }

  getPosition() {
    const position = super.getPosition();

    if (this.vis.useVersionDatabase) {
      position.row =  this.index;
    } else {
      position.column = this.index;
    }

    return position;
  }

  @computed get name() {
    if (this.vis.useVersionDatabase) {
      if (this.vis.files.indexOf(this) === 0) {
        return 'file';
      }

      return `Version ${this.parent.children.length - this.index}`;
    }

    if (this.nameIndex === 0) {
      return 'file';
    }

    return `file${FILE_NAME_VARIANTS[(this.nameIndex - 1) % FILE_NAME_VARIANTS.length]}`;
  }

  @computed get changes() {
    return this.diff.added + this.diff.removed;
  }

  @computed get maxChanges() {
    return Math.max(
      ...this.vis.files.map(file => file.changes),
    );
  }

  @action copy() {
    const copy = new this.constructor(this.vis, this.nameIndex);

    copy.status = STATUS_MODIFIED;

    return copy;
  }
}

class VersionDatabaseVisualisation extends Visualisation {
  @observable files = [];
  @observable useVersionDatabase = false;
  @observable nameIndex = 0;

  constructor() {
    super();

    this.versionDatabase = new VisualisationArea('Version Database');

    this.versionDatabase.column = 1;
    this.versionDatabase.height = 10;

    this.versionDatabase.getChildren = () => this.getVersionDatabaseChildren();
    this.versionDatabase.getParent = () => this;
  }

  getVersionDatabaseChildren() {
    return this.files.slice(1);
  }

  addFile() {
    const file = new FileVisualisation(this, this.nameIndex++);

    this.files.unshift(file);
  }

  modifyFile(fileIndex, diff) {
    const file = this.files[fileIndex];

    file.diff.added += diff.added;
    file.diff.removed += diff.removed;
  }

  copyFile(fileIndex) {
    const file = this.files[fileIndex];
    const copy = file.copy();

    copy.nameIndex = this.nameIndex++;

    this.files.unshift(copy);
  }

  deleteFile(fileIndex) {
    const file = this.files[fileIndex];

    if (!this.useVersionDatabase) {
      this.files.remove(file);
    } else {
      file.status = STATUS_DELETED;
    }
  }

  restoreFile(fileIndex) {
    const file = this.files[fileIndex];
    const current = this.files[0];

    current.diff = file.diff;
    current.status = STATUS_MODIFIED;
  }

  getFileParent() {
    return this;
  }

  getParent() {
    return null;
  }

  getChildren() {
    if (this.useVersionDatabase) {
      return [
        this.files[0],
        this.versionDatabase,
      ]
    }

    return this.files;
  }
}

export default VersionDatabaseVisualisation;
