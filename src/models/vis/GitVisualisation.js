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

    for (let [file, blob] of this.commit.tree) {
      let status = STATUS_UNMODIFIED;
      let parentBlob;
      let diff;

      if (this.commit.parent != null) {
        parentBlob = this.commit.parent.tree.get(file);
      }

      if (parentBlob == null) { // -> previousBlob
        // File was added in this commit.
        status = STATUS_ADDED;
      } else if (parentBlob !== blob) { // -> previousBlob
        // File was changed in this commit.
        status = STATUS_MODIFIED;
        diff = blob.diff(parentBlob);
      }

      children.push(new FileVisualisation(this.vis, this, file, status, diff));
    }

    if (this.commit.parent != null) {
      for (let file of this.commit.parent.tree.keys()) {
        if (this.commit.tree.has(file)) {
          continue;
        }

        children.push(new FileVisualisation(this.vis, this, file, STATUS_DELETED));
      }
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
    this.fileList.getChildren = () => this.getFileListChildren();
  }

  getFileListChildren() {
    const { stagingArea, head } = this.repo;
    const children = [];

    for (let [file, blob] of stagingArea.tree) {
      let status;
      let committedBlob;
      let diff;

      if (head.commit != null) {
        committedBlob = head.commit.tree.get(file);
      }

      if (committedBlob == null) {
        status = STATUS_ADDED;
      } else if (committedBlob !== blob) {
        status = STATUS_MODIFIED;
        diff = blob.diff(committedBlob);
      } else {
        // Don't show unmodified.
        continue;
      }

      children.push(new FileVisualisation(this.vis, this.fileList, file, status, diff));
    }

    if (head.commit != null) {
      for (let file of head.commit.tree.keys()) {
        if (stagingArea.tree.has(file)) {
          continue;
        }

        children.push(new FileVisualisation(this.vis, this.fileList, file, STATUS_DELETED));
      }
    }

    return sortBy(children, children => children.file.name);
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
    this.fileList.getChildren = () => this.getFileListChildren();
  }

  getFileListChildren() {
    const { stagingArea, workingDirectory } = this.repo;
    const children = [];

    for (let [file, blob] of workingDirectory.tree) {
      let status = STATUS_UNMODIFIED;
      let stagedBlob;
      let diff;

      stagedBlob = stagingArea.tree.get(file);

      if (stagedBlob == null) {
        // File was added in this commit.
        status = STATUS_ADDED;
      } else if (stagedBlob !== blob) {
        // File was changed in this commit.
        status = STATUS_MODIFIED;
        diff = blob.diff(stagedBlob);
      }

      children.push(new FileVisualisation(this.vis, this.fileList, file, status, diff));
    }

    for (let file of stagingArea.tree.keys()) {
      if (workingDirectory.tree.has(file)) {
        continue;
      }

      children.push(new FileVisualisation(this.vis, this.fileList, file, STATUS_DELETED));
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
  isGit = true;

  @observable useWorkingDirectory = true;
  @observable useStagingArea = true;
  @observable useRepository = true;

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
    const children = [];

    if (this.useWorkingDirectory) {
      children.push(this.workingDirectory);
    }

    if (this.useStagingArea) {
      children.push(this.stagingArea);
    }

    if (this.useRepository) {
      children.push(this.repository);
    }

    return children;
  }
}

export default GitVisualisation;
