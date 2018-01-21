import { computed, observable, action, reaction } from "mobx";
import { Set } from "immutable";
import sortBy from 'lodash/sortBy';

import Visualisation from "./Visualisation";
import VisualisationArea from "./VisualisationArea";
import VisualisationFileList from "./VisualisationFileList";
import VisualisationFile from "./VisualisationFile";
import { STATUS_ADDED, STATUS_MODIFIED, STATUS_UNMODIFIED, STATUS_DELETED } from "../../constants";

class FileVisualisation extends VisualisationFile {
  @observable status;
  @observable diff;

  constructor(file) {
    super();

    this.file = file;
  }

  @computed get changeRelatedFiles() {
    return [];
    /*if (this.parent.isCommit) {
      // File belongs to commit.
      return this.parent.children;
    }

    // File belongs to Staging Area or Working Directory
    return [
      ...this.vis.stagingArea.fileList.children,
      ...this.vis.workingDirectory.fileList.children,
    ];*/
  }

  @computed get changes() {
    return this.diff.added + this.diff.removed;
  }

  @computed get maxChanges() {
    return this.changes;
    /*return Math.max(
      ...this.changeRelatedFiles.map(file => file.changes),
    );*/
  }

  @action copy() {
    const copy = super.copy(this.file);

    copy.status = this.status;
    copy.diff = this.diff;

    return copy;
  }
}

class CommitVisualisation extends VisualisationFileList {
  isCommit = true;

  constructor(vis, commit) {
    super();

    this.vis = vis;
    this.commit = commit;

    reaction(() => ({
      tree: this.commit.tree,
      parentTree: this.commit.parent != null && this.commit.parent.tree,
    }), this.handleTreeChanges, true);
  }

  getPosition() {
    const position = super.getPosition();

    position.row += (
      this.parent.children.length - (this.parent.children.indexOf(this) + 1)
    );

    return position;
  }

  @action getChild(file, status, diff = { added: 0, removed: 0 }) {
    let child = this.find(object => {
      return object.isFile && object.file === file;
    });

    if (child == null) {
      child = new FileVisualisation(file);
    }

    child.status = status;
    child.diff = diff;

    return child;
  }

  @action.bound handleTreeChanges() {
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

      children.push(this.getChild(file, status, diff));
    }

    if (this.commit.parent != null) {
      for (let file of this.commit.parent.tree.keys()) {
        if (this.commit.tree.has(file)) {
          continue;
        }

        children.push(this.getChild(file, STATUS_DELETED));
      }
    }

    this.set(
      ...sortBy(children, visFile => visFile.file.name)
    );
  }
}

class StagingAreaVisualisation extends VisualisationArea {
  isStagingArea = true;

  constructor(vis, repo) {
    super('Staging Area');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.add(this.fileList);

    reaction(() => ({
      stagingAreaTree: this.repo.stagingArea.tree,
      headCommitTree: this.repo.head.commit != null && this.repo.head.commit.tree,
    }), this.handleTreeChanges, true);
  }

  getChild(file, status, diff = { added: 0, removed: 0 }) {
    let child = this.find(object => object.isFile && object.file === file);

    if (child == null) {
      child = new FileVisualisation(file);
    }

    child.status = status;
    child.diff = diff;

    return child;
  }

  @action.bound handleTreeChanges() {
    const { stagingArea, head } = this.repo;
    const children = [];

    for (let [file, blob] of stagingArea.tree) {
      let status = STATUS_UNMODIFIED;
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
        continue;
      }

      children.push(this.getChild(file, status, diff));
    }

    if (head.commit != null) {
      for (let file of head.commit.tree.keys()) {
        if (stagingArea.tree.has(file)) {
          continue;
        }

        children.push(this.getChild(file, STATUS_DELETED));
      }
    }

    this.fileList.set(
      ...sortBy(children, children => children.file.name)
    );
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
    this.add(this.fileList);

    reaction(() => ({
      workingDirectoryTree: this.repo.workingDirectory.tree,
      stagingAreaTree: this.repo.stagingArea.tree,
    }), this.handleTreeChanges, true);
  }

  @action getChild(file, status, diff = { added: 0, removed: 0 }) {
    let child = this.find(object => {
      return object.isFile && object.file === file;
    });

    if (child == null) {
      child = new FileVisualisation(file);
    }

    child.status = status;
    child.diff = diff;

    return child;
  }

  @action.bound handleTreeChanges(tree) {
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

      children.push(this.getChild(file, status, diff));
    }

    for (let file of stagingArea.tree.keys()) {
      if (workingDirectory.tree.has(file)) {
        continue;
      }

      children.push(this.getChild(file, STATUS_DELETED));
    }

    this.fileList.set(
      ...sortBy(children, visFile => visFile.file.name)
    );
  }
}

class RepositoryVisualisation extends VisualisationArea {
  isRepository = true;

  constructor(vis, repo) {
    super('repository');

    this.vis = vis;
    this.repo = repo;
    this.height = 10;
    this.width = 10;

    reaction(() => ({
      commits: this.repo.commits,
    }), this.handleCommitChanges, true);
  }

  @action.bound handleCommitChanges() {
    const children = [];

    for (let commit of this.repo.commits) {
      children.push(this.getChild(commit));
    }

    this.set(...children);
  }

  @action getChild(commit) {
    let child = this.find(object => {
      return object.isCommit && object.commit === commit;
    });

    if (child == null) {
      child = new CommitVisualisation(this.vis, commit);
    }

    return child;
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
    this.add(this.workingDirectory);

    this.stagingArea = new StagingAreaVisualisation(this, this.repo);
    this.stagingArea.column = 1;
    this.add(this.stagingArea);

    this.repository = new RepositoryVisualisation(this, this.repo);
    this.repository.column = 2;
    this.add(this.repository);
  }

  @computed get files() {
    let files = Set.fromKeys(this.repo.workingDirectory.tree);

    if (this.repo.stagingArea.tree != null) {
      files = files.concat(this.repo.stagingArea.tree.keySeq());
    }

    if (this.repo.head.commit != null) {
      files = files.concat(this.repo.head.commit.tree.keySeq());
    }

    return sortBy(files.toArray(), file => file.name);
  }

  getVersions(file) {
    return this.filter(object => object.isFile && object !== file && object.file.blob === file.file.blob);
  }
}

export default GitVisualisation;
