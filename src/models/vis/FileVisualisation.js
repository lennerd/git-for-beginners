import { computed, action } from 'mobx';

import VisualisationFile from './VisualisationFile';
import {
  STATUS_DELETED,
  STATUS_ADDED,
  STATUS_UNMODIFIED,
  STATUS_MODIFIED,
} from '../../constants';

class FileVisualisation extends VisualisationFile {
  constructor(vis, file, prevVisFile) {
    super();

    this.vis = vis;
    this.file = file;
    this.prevVisFile = prevVisFile;
  }

  @computed
  get container() {
    let parent = this.parent;

    while (parent != null) {
      if (parent.isContainer) {
        return parent;
      }

      parent = parent.parent;
    }

    return null;
  }

  @computed
  get tree() {
    if (this.container == null) {
      return null;
    }

    return this.container.tree;
  }

  @computed
  get parentTree() {
    if (this.container == null) {
      return null;
    }

    return this.container.parentTree;
  }

  @computed
  get blob() {
    if (this.tree == null) {
      return null;
    }

    return this.tree.get(this.file);
  }

  @computed
  get parentBlob() {
    if (this.parentTree == null) {
      return null;
    }

    return this.parentTree.get(this.file);
  }

  @computed
  get status() {
    if (this.blob == null) {
      return STATUS_DELETED;
    }

    if (this.parentBlob == null) {
      return STATUS_ADDED;
    }

    if (this.blob === this.parentBlob) {
      return STATUS_UNMODIFIED;
    }

    return STATUS_MODIFIED;
  }

  @computed
  get diff() {
    if (this.blob == null || this.parentBlob == null) {
      return { added: 0, removed: 0 };
    }

    return this.blob.diff(this.parentBlob);
  }

  @computed
  get changeRelatedFiles() {
    if (this.parent.isCommit) {
      // File belongs to commit.
      return this.parent.files;
    }

    // File belongs to Staging Area or Working Directory
    return [
      ...this.vis.stagingArea.fileList.children,
      ...this.vis.workingDirectory.fileList.children,
    ];
  }

  @computed
  get changes() {
    return this.diff.added + this.diff.removed;
  }

  @computed
  get maxChanges() {
    return Math.max(...this.changeRelatedFiles.map(file => file.changes));
  }

  @action
  copy() {
    const copy = super.copy(this.file);

    copy.status = this.status;
    copy.diff = this.diff;

    return copy;
  }
}

export default FileVisualisation;
