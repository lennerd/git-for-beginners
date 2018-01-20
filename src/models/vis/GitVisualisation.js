import { observable, computed, action, autorun } from "mobx";

import Visualisation from "./Visualisation";
import VisualisationCommit from "./VisualisationCommit";
import VisualisationArea from "./VisualisationArea";
import VisualisationFileList from "./VisualisationFileList";
import VisualisationFile from "./VisualisationFile";
import { STATUS_ADDED, STATUS_MODIFIED, STATUS_UNMODIFIED, STATUS_DELETED } from "../../constants";
import { Set } from "immutable";

class FileVisualisation extends VisualisationFile {
  constructor(fileList, file, status) {
    super();

    this.fileList = fileList;
    this.file = file;
    this.status = status;
  }

  getChildren() {
    return [];
  }

  getParent() {
    return this.fileList;
  }
}

class StagingAreaVisualisation extends VisualisationArea {
  constructor(vis, repo) {
    super('Staging Area');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.fileList.getParent = () => this;
    this.fileList.getChildren = () => this.files;
  }

  @computed get files() {
    const filesVis = [];

    let files = Set.fromKeys(this.repo.stagingArea.tree);

    if (this.repo.head.commit != null) {
      files = files.concat(this.repo.head.commit.keySeq());
    }

    for (let file of files) {
      let status = STATUS_ADDED;

      filesVis.push(new FileVisualisation(this.fileList, file, status));
    }

    return filesVis;
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
  constructor(vis, repo) {
    super('Working Directory');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.fileList.getParent = () => this;
    this.fileList.getChildren = () => this.fileListChildren;
  }

  @computed get fileListChildren() {
    const children = [];

    for (let file of this.vis.files) {
      const stagedBlob = this.repo.stagingArea.tree.get(file);

      let status = STATUS_ADDED;

      if (stagedBlob != null) {
        if (!this.repo.workingDirectory.files.includes(file)) {
          // File is in the staging area but not in the working directory anymore
          status = STATUS_DELETED;
        } else if (stagedBlob === file.blob) {
          // File is staged. No further modifications.
          status = STATUS_UNMODIFIED;
        } else {
          // File is staged. Further modification has been made.
          status = STATUS_MODIFIED;
        }
      }

      children.push(new FileVisualisation(this.fileList, file, status));
    }

    return children;
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
  constructor(vis) {
    super('repository');

    this.vis = vis;
    this.height = 10;
    this.width = 4;
  }

  getParent() {
    return this.vis;
  }

  getChildren() {
    return [];
  }
}

class GitVisualisation extends Visualisation {
  constructor(repo) {
    super();

    this.repo = repo;

    this.workingDirectory = new WorkingDirectoryVisualisation(this, this.repo);

    this.stagingArea = new StagingAreaVisualisation(this, this.repo);
    this.stagingArea.column = 1;

    this.repository = new RepositoryVisualisation(this);
    this.repository.column = 2;
  }

  @computed get files() {
    let files = Set.fromKeys(this.repo.workingDirectory.tree).concat(
      this.repo.stagingArea.tree.keySeq(),
    );

    if (this.repo.head.commit != null) {
      files = files.concat(this.repo.head.commit.keySeq());
    }

    return files;
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
