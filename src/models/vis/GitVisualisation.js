import { computed } from "mobx";
import React from "react";
import { Set } from "immutable";
import sortBy from 'lodash/sortBy';
import padEnd from 'lodash/padEnd';

import Visualisation from "./Visualisation";
import { STATUS_ADDED, STATUS_UNMODIFIED, STATUS_DELETED } from "../../constants";
import File from "../File";
import { VisualisationFileReference, VisualisationCommitReference } from "../../components/VisualisationObjectReference";
import ConsoleError from "../ConsoleError";
import WorkingDirectoryVisualisation from "./WorkingDirectoryVisualisation";
import StagingAreaVisualisation from "./StagingAreaVisualisation";
import RepositoryVisualisation from "./RepositoryVisualisation";
import FileVisualisation from "./FileVisualisation";
import CommitVisualisation from "./CommitVisualisation";

class GitVisualisation extends Visualisation {
  isGit = true;

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

  toggleWorkingDirectory() {
    if (this.workingDirectory.parent == null) {
      this.add(this.workingDirectory);
    } else {
      this.remove(this.workingDirectory);
    }
  }

  toggleStagingArea() {
    if (this.stagingArea.parent == null) {
      this.add(this.stagingArea);
    } else {
      this.remove(this.stagingArea);
    }
  }

  toggleRepository() {
    if (this.repository.parent == null) {
      this.add(this.repository);
    } else {
      this.remove(this.repository);
    }
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

  getVersions(visFile) {
    return this.filter(object => (
      object.isFile && object !== visFile && object.file === visFile.file
    ));
  }

  addFile() {
    const file = File.create();

    this.repo.workingDirectory.addFile(file);

    // Create a new file vis
    const visFile = new FileVisualisation(this, file);
    this.workingDirectory.fileList.add(visFile);

    return visFile;
  }

  stageFile(fileIndex) {
    const file = this.files[fileIndex];

    // Get the file vis from the working directory
    const visFiles = this.workingDirectory.filter(object => object.isFile && object.file === file);

    if (visFiles.length === 0) {
      throw new ConsoleError('Cannot stage. File is missing.');
    }

    // Remove all the copies from the working directory if the status was deleted
    if (visFiles[0].status === STATUS_DELETED) {
      this.workingDirectory.fileList.remove(...visFiles);

      const stagedVisFiles = this.stagingArea.filter(object => object.isFile && object.file === file);

      // Remove also all the files from the staging area if it is added
      if (stagedVisFiles.length > 0 && stagedVisFiles[0].status === STATUS_DELETED) {
        this.stagingArea.fileList.remove(...stagedVisFiles);
      }
    // Create a copy in the working directory if needed
    } else if (visFiles.length === 1) {
      this.workingDirectory.fileList.add(new FileVisualisation(this, file));
    }

    // Move it into the staging area
    this.repo.stageFile(file);
    this.stagingArea.fileList.add(visFiles[0]);

    const stagedVisFiles = this.stagingArea.filter(object => object.isFile && object.file === file);
    const committedVisFile = this.repository.find(object => object.isFile && object.file === file);

    // Remove all the files from the staging are, if there are deleted.
    // @TODO Check if parent tree exists. So this is a deletion to the next version.
    if (committedVisFile == null && stagedVisFiles[0].status === STATUS_DELETED) {
      this.stagingArea.fileList.remove(...stagedVisFiles);
    }

    return visFiles[0];
  }

  unstageFile(fileIndex) {
    const file = this.files[fileIndex];

    this.repo.unstageFile(file);

    // Get all files vis staged to the staging area. Get all in case user staged multiple times.
    const stagedVisFiles = this.stagingArea.filter(object => object.isFile && object.file === file);

    // Move the first of these files back to the working directory.
    this.workingDirectory.fileList.add(stagedVisFiles[0]);

    // Remove the other ones, if needed.
    if (stagedVisFiles.length > 1) {
      this.stagingArea.fileList.remove(...stagedVisFiles);
    }

    return stagedVisFiles[0];
  }

  deleteFile(fileIndex) {
    const file = this.files[fileIndex];

    // Get all file vis for this file. Can be more because we create copies in the working directory.
    const visFiles = this.workingDirectory.filter(object => object.isFile && object.file === file);

    // Remove the file if it is newly added.
    if (visFiles.length > 0 && visFiles[0].status === STATUS_ADDED) {
      this.workingDirectory.fileList.remove(...visFiles);
    }

    this.repo.workingDirectory.removeFile(file);

    return visFiles[0];
  }

  modifyFile(fileIndex) { // Done
    const file = this.files[fileIndex];

    if (file == null) {
      console.error('Missing file.');
      return;
    }

    file.modify();
    this.repo.workingDirectory.addFile(file);

    return this.workingDirectory.find(object => object.isFile && object.file === file);
  }

  createCommit() {
    const commit = this.repo.createCommit();

    // Create a new commit vis
    const visCommit = new CommitVisualisation(this.vis, this.repo.head, commit);

    // Move all the files from the staging area to the commit
    const stagedVisFiles = this.stagingArea.filter(object => object.isFile);
    visCommit.add(...stagedVisFiles);

    // Look for a parent commit and merge the files into our new one.
    if (commit.parent != null) {
      const parentVisCommit = this.repository.find(object => object.isCommit && object.commit === commit.parent);

      // Wait, do not copy all the files! Only the one, not present in the staging area.
      const parentVisFiles = parentVisCommit.filter(object => object.isFile).filter(
        parentVisFile => (
          parentVisFile.status !== STATUS_DELETED &&
          !stagedVisFiles.some(stagedVisFile => stagedVisFile.file === parentVisFile.file)
        )
      );

      // Create copy of all the files in the parent commit
      for (let parentVisFile of parentVisFiles) {
        parentVisCommit.add(new FileVisualisation(this, parentVisFile.file, parentVisFile.position));
      }

      // Finally copy all the files from the parent commit into our new one.
      visCommit.add(...parentVisFiles);
    }

    // Move commit to repository
    this.repository.head.add(visCommit);

    return visCommit;
  }

  revertCommit(commitChecksum) {
    const commit = this.repo.commits.find(commit => commit.checksum === commitChecksum);

    if (commit == null) {
      console.error('Missing commit');
      return;
    }

    // We essentially reset to the parent before, due to simplified rules for this vis.
    // This is the first commit, so reset the working directory
    /*if (commit.parent == null) {
      this.workingDirectory.fileList.remove(...this.workingDirectory.fileList.files());

      return;
    }*/

    // Get commit vis.
    const visCommit = this.repository.find(object => object.isCommit && object.commit === commit);

    // Filter files inside the commit for changes
    const changedVisFiles = visCommit.filter(object => (
      object.isFile && object.status !== STATUS_UNMODIFIED
    ));

    // Copy all changed files from the commit as visualisation backups.
    for (let changedVisFile of changedVisFiles) {
      visCommit.add(new FileVisualisation(this, changedVisFile.file));
    }

    // Move them into the working directory
    this.workingDirectory.fileList.add(...changedVisFiles);

    this.repo.revertCommit(commit);

    return visCommit;
  }

  getStatus() {
    const status = { unstaged: [], staged: [], branch: this.repo.head.name };

    this.files.forEach(file => {
      const stagedVisFile = this.stagingArea.find(object => (
        object.isFile && object.file === file && object.status !== STATUS_UNMODIFIED
      ));

      if (stagedVisFile != null) {
        status.staged.push({ visFile: stagedVisFile, status: stagedVisFile.status });

        return;
      }

      const unstagedVisFile = this.workingDirectory.find(object => (
        object.isFile && object.file === file && object.status !== STATUS_UNMODIFIED
      ));

      if (unstagedVisFile != null) {
        status.unstaged.push({ visFile: unstagedVisFile, status: unstagedVisFile.status });

        return;
      }
    });

    if (status.unstaged.length === 0) {
      status.unstaged = null;
    }

    if (status.staged.length === 0) {
      status.staged = null;
    }

    return status;
  }
}

const FILE_STATUS_SPACES = 11;

function react(pieces, ...substitutions) {
  const children = [pieces[0]];

  for (var i = 0; i < substitutions.length; ++i) {
    children.push(substitutions[i]);
    children.push(pieces[i + 1]);
  }

  return children;
}

function createFileStatus(vis, file) {
  let status = 'modified';

  if (file.status === STATUS_ADDED) {
    status = 'added';
  } else if (file.status === STATUS_DELETED) {
    status = 'deleted';
  }

  return react`${padEnd(status, FILE_STATUS_SPACES)}${
    <VisualisationFileReference key={file.visFile.id} vis={vis} file={file.visFile} />
  }`;
}

function createStagedStatus(vis, staged) {
  return react`Changes to be committed:${staged.map(file => react`\n${createFileStatus(vis, file)}`)}`;
}

function createUnstagedStatus(vis, unstaged) {
  return react`Changes not staged for commit:${unstaged.map(file => react`\n${createFileStatus(vis, file)}`)}`;
}

export function createStatusMessage(vis, status) {
  return react`${
    status.staged != null ? createStagedStatus(vis, status.staged) : ''
  }${
    status.staged != null && status.unstaged != null ? '\n\n' : ''
  }${
    status.unstaged != null ? createUnstagedStatus(vis, status.unstaged) : ''
  }`;
}

function createCommitDiff(visCommit) {
  const visFiles = visCommit.filter(object => (
    object.isFile && object.status !== STATUS_UNMODIFIED
  ));

  const diff = visFiles.reduce((diff, visFile) => {
    diff.added = visFile.diff.added;
    diff.removed = visFile.diff.removed;

    return diff;
  }, { added: 0, removed: 0 });

  return `${visFiles.length} file${visFiles.length !== 1 ? 's' : ''} changed, ${diff.added} insertions(+), ${diff.removed} deletions(-)`;
}

export function createCommitMessage(vis, visCommit) {
  return react`[master ${<VisualisationCommitReference key={visCommit.id}  vis={vis} commit={visCommit} />}] Commit message
${createCommitDiff(visCommit)}
`;
}

export default GitVisualisation;
