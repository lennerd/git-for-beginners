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
  get parentTrees() {
    if (this.container == null) {
      return [];
    }

    return this.container.parentTrees;
  }

  @computed
  get blob() {
    if (this.tree == null) {
      return null;
    }

    return this.tree.get(this.file);
  }

  @computed
  get parentBlobs() {
    return this.parentTrees
      .map(tree => tree.get(this.file))
      .filter(blob => blob != null);
  }

  @computed
  get status() {
    if (this.blob == null) {
      return STATUS_DELETED;
    }

    this.parentBlobs.forEach(blob => {
      if (blob == null) {
        debugger;
      }
    });

    if (this.parentBlobs.length === 0) {
      return STATUS_ADDED;
    }

    if (this.parentBlobs.every(blob => blob === this.blob)) {
      return STATUS_UNMODIFIED;
    }

    return STATUS_MODIFIED;
  }

  @computed
  get diff() {
    if (this.blob == null || this.parentBlobs.length === 0) {
      return { added: 0, removed: 0 };
    }

    return this.parentBlobs.reduce(
      (diff, parentBlob) => {
        const { added, removed } = this.blob.diff(parentBlob);

        return {
          added: diff.added + added,
          removed: diff.removed + removed,
        };
      },
      { added: 0, removed: 0 },
    );
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
