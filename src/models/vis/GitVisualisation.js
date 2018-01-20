import { computed, observable } from "mobx";

import Visualisation from "./Visualisation";
import VisualisationArea from "./VisualisationArea";
import VisualisationFileList from "./VisualisationFileList";
import VisualisationFile from "./VisualisationFile";
import { STATUS_ADDED, STATUS_MODIFIED, STATUS_UNMODIFIED, STATUS_DELETED } from "../../constants";
import { Set } from "immutable";
import sortBy from 'lodash/sortBy';

class FileVisualisation extends VisualisationFile {
  constructor(vis, fileList, file, status, diff = { added: 0, removed: 0 }) {
    super();

    this.vis = vis;
    this.fileList = fileList;
    this.file = file;
    this.status = status;
    this.diff = diff;
  }

  getChildren() {
    return [];
  }

  getParent() {
    return this.fileList;
  }

  @computed get changeRelatedFiles() {
    if (this.parent.isCommit) {
      // File belongs to commit.
      return this.parent.children;
    }

    // File belongs to Staging Area or Working Directory
    return [
      ...this.vis.stagingArea.fileList.children,
      ...this.vis.workingDirectory.fileList.children,
    ];
  }

  @computed get changes() {
    return this.diff.added + this.diff.removed;
  }

  @computed get maxChanges() {
    return Math.max(
      ...this.changeRelatedFiles.map(file => file.changes),
    );
  }
}


class CommitVisualisation extends VisualisationFileList {
  isCommit = true;

  constructor(repository, commit) {
    super();

    this.repository = repository;
    this.commit = commit;
  }

  getPosition() {
    const position = super.getPosition();

    position.row += (
      this.parent.children.length - (this.parent.children.indexOf(this) + 1)
    );

    return position;
  }

  getParent() {
    return this.repository;
  }

  getChildren() {
    const children = [];

    let files = Set.fromKeys(this.commit.tree);

    if (this.commit.parent != null) {
      files = files.concat(this.commit.parent.tree.keySeq());
    }

    for (let file of files) {
      let status = STATUS_UNMODIFIED;
      let parentBlob;
      let diff;

      if (this.commit.tree.has(file)) {
        // File is part of this commit.
        if (this.commit.parent != null) {
          parentBlob = this.commit.parent.tree.get(file);
        }

        if (parentBlob == null) {
          // File was added in this commit.
          status = STATUS_ADDED;
        }

        if (parentBlob != null && parentBlob !== file.blob) {
          // File was changed in this commit.
          status = STATUS_MODIFIED;
          diff = file.blob.diff(parentBlob);
        }
      } else if (this.commit.parent != null && this.commit.parent.tree.has(file)) {
        // File is not part of this commit.
        status = STATUS_DELETED;
      } else {
        continue;
      }

      children.push(new FileVisualisation(this.vis, this, file, status, diff));
    }

    return sortBy(children, visFile => visFile.file.name);
  }
}

class StagingAreaVisualisation extends VisualisationArea {
  isStagingArea = true;

  constructor(vis, repo) {
    super('Staging Area');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.fileList.getParent = () => this;
    this.fileList.getChildren = () => this.visFiles;
  }

  @computed get visFiles() {
    const { stagingArea, workingDirectory, head } = this.repo;
    const visFiles = [];

    if (stagingArea.tree == null) {
      return visFiles;
    }

    for (let file of this.vis.files) {
      let status;
      let diff;
      let committedBlob;

      if (stagingArea.tree.has(file)) {
        // File is staged.

        if (head.commit != null) {
          // Get blob from the last commit.
          committedBlob = head.commit.tree.get(file);
        }

        if (committedBlob == null) {
          // No committed file. Staged file is new.
          status = STATUS_ADDED;
        }

        if (committedBlob != null && committedBlob !== file.blob) {
          // Staged file was modified since the last commit.
          status = STATUS_MODIFIED;
          diff = file.blob.diff(committedBlob);
        }
      } else if (
        head.commit != null && head.commit.tree.has(file) &&
        !workingDirectory.tree.has(file)
      ) {
        // File only exists in the last commit, but not in the working directory.
        status = STATUS_DELETED;
      } else {
        // Skip the rest.
        continue;
      }

      visFiles.push(new FileVisualisation(this.vis, this.fileList, file, status, diff));
    }

    return sortBy(visFiles, visFile => visFile.file.name);
  }

  getParent() {
    return this.vis;
  }

  getChildren() {
    return [
      this.fileList,
    ];
  }
}

class WorkingDirectoryVisualisation extends VisualisationArea {
  isWorkingDirectory = true;

  constructor(vis, repo) {
    super('Working Directory');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.fileList.getParent = () => this;
    this.fileList.getChildren = () => this.fileListChildren;
  }

  @computed get fileListChildren() {
    const { stagingArea, workingDirectory, head } = this.repo;
    const children = [];

    for (let file of this.vis.files) {
      let status = STATUS_UNMODIFIED;
      let diff;
      let stagedBlob;
      let committedBlob;

      if (workingDirectory.tree.has(file)) {
        // File is part of the working directory.

        if (stagingArea.tree != null) {
          // Get staged file blob.
          stagedBlob = stagingArea.tree.get(file);
        }

        if (head.commit != null) {
          // Get committed file blob.
          committedBlob = head.commit.tree.get(file);
        }

        if (stagedBlob == null && committedBlob == null) {
          // File is added if no staged or committed blob exist.
          status = STATUS_ADDED;
        }

        // First check for staged file and THEN for committed file.
        if (stagedBlob != null) {
          // Staged file exists.

          if (stagedBlob !== file.blob) {
            // File has different content than the file in the staging area.
            status = STATUS_MODIFIED;
            diff = file.blob.diff(stagedBlob);
          }
        } else if (committedBlob != null) {
          // Committed file exists.

          if (committedBlob !== file.blob) {
            // File has different content than the file in the repository.
            status = STATUS_MODIFIED;
            diff = file.blob.diff(committedBlob);
          }
        }
      } else if (
        (stagingArea.tree == null || stagingArea.tree.has(file)) ||
        (head.commit != null && head.commit.has(file))
      ) {
        // File is not part of the working directory and staging area, but only the last commit.
        status = STATUS_DELETED;
      } else {
        // Skip the rest.
        continue;
      }

      children.push(new FileVisualisation(this.vis, this.fileList, file, status, diff));
    }

    return sortBy(children, visFile => visFile.file.name);
  }

  getParent() {
    return this.vis;
  }

  getChildren() {
    return [
      this.fileList,
    ];
  }
}

class RepositoryVisualisation extends VisualisationArea {
  isRepository = true;

  constructor(vis, repo) {
    super('repository');

    this.vis = vis;
    this.repo = repo;
    this.height = 10;
    this.width = 4;
  }

  getParent() {
    return this.vis;
  }

  getChildren() {
    const visCommits = [];

    for (let commit of this.repo.commits) {
      visCommits.push(new CommitVisualisation(this, commit));
    }

    return visCommits;
  }
}

class GitVisualisation extends Visualisation {
  constructor(repo) {
    super();

    this.repo = repo;

    this.workingDirectory = new WorkingDirectoryVisualisation(this, this.repo);

    this.stagingArea = new StagingAreaVisualisation(this, this.repo);
    this.stagingArea.column = 1;

    this.repository = new RepositoryVisualisation(this, this.repo);
    this.repository.column = 2;
  }

  @computed get files() {
    let files = Set.fromKeys(this.repo.workingDirectory.tree);

    if (this.repo.stagingArea.tree != null) {
      files = files.concat(this.repo.stagingArea.tree.keySeq());
    }

    if (this.repo.head.commit != null) {
      files = files.concat(this.repo.head.commit.tree.keySeq());
    }

    return files;
  }

  getVersions(file) {
    return this.filter(object => object.isFile && object !== file && object.file.blob === file.file.blob);
  }

  getParent() {
    return null;
  }

  getChildren() {
    return [
      this.workingDirectory,
      this.stagingArea,
      this.repository,
    ];
  }
}

export default GitVisualisation;
