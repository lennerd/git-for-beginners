import { computed, action } from 'mobx';
import React from 'react';
import { Set } from 'immutable';
import sortBy from 'lodash/sortBy';
import padEnd from 'lodash/padEnd';
import uniqBy from 'lodash/uniqBy';

import Visualisation from './Visualisation';
import {
  STATUS_ADDED,
  STATUS_UNMODIFIED,
  STATUS_DELETED,
} from '../../constants';
import File from '../File';
import {
  VisualisationFileReference,
  VisualisationCommitReference,
} from '../../components/VisualisationObjectReference';
import ConsoleError from '../ConsoleError';
import WorkingDirectoryVisualisation from './WorkingDirectoryVisualisation';
import StagingAreaVisualisation from './StagingAreaVisualisation';
import RepositoryVisualisation from './RepositoryVisualisation';
import FileVisualisation from './FileVisualisation';
import CommitVisualisation from './CommitVisualisation';
import BranchVisualisation from './BranchVisualisation';
import PointerVisualisation from './PointerVisualisation';

class GitVisualisation extends Visualisation {
  isGit = true;
  showBranches = false;

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

    const visHead = new BranchVisualisation(this, this.repo.head);
    this.repository.add(visHead);
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

  @computed
  get files() {
    /*let files = Set.fromKeys(this.repo.workingDirectory.tree);

    if (this.repo.stagingArea.tree != null) {
      files = files.concat(this.repo.stagingArea.tree.keySeq());
    }

    if (this.repo.head.commit != null) {
      files = files.concat(this.repo.head.commit.tree.keySeq());
    }*/

    const files = uniqBy(this.visFiles, visFile => visFile.file).map(
      visFile => visFile.file,
    );

    return sortBy(files /*.toArray()*/, file => file.name);
  }

  @computed
  get head() {
    return this.visBranches.find(
      visBranch => visBranch.branch === this.repo.head,
    );
  }

  getVersions(visFile) {
    return this.filter(
      object =>
        object.isFile && object !== visFile && object.file === visFile.file,
    );
  }

  @action
  addFile() {
    const file = File.create();

    this.repo.workingDirectory.addFile(file);

    // Create a new file vis
    const visFile = new FileVisualisation(this, file);
    this.workingDirectory.fileList.add(visFile);

    return visFile;
  }

  @action
  stageFile(fileIndex) {
    const file = this.files[fileIndex];

    // Get the file vis from the working directory
    const visFiles = this.workingDirectory.filter(
      object => object.isFile && object.file === file,
    );

    if (visFiles.length === 0) {
      throw new ConsoleError('Cannot stage. File is missing.');
    }

    // Remove all the copies from the working directory if the status was deleted
    if (visFiles[0].status === STATUS_DELETED) {
      this.workingDirectory.fileList.remove(...visFiles);

      const stagedVisFiles = this.stagingArea.filter(
        object => object.isFile && object.file === file,
      );

      // Remove also all the files from the staging area if it is added
      if (
        stagedVisFiles.length > 0 &&
        stagedVisFiles[0].status === STATUS_DELETED
      ) {
        this.stagingArea.fileList.remove(...stagedVisFiles);
      }
      // Create a copy in the working directory if needed
    } else if (visFiles.length === 1) {
      this.workingDirectory.fileList.add(new FileVisualisation(this, file));
    }

    // Move it into the staging area
    this.repo.stageFile(file);
    this.stagingArea.fileList.add(visFiles[0]);

    const stagedVisFiles = this.stagingArea.filter(
      object => object.isFile && object.file === file,
    );
    const committedVisFile = this.repository.find(
      object => object.isFile && object.file === file,
    );

    // Remove all the files from the staging are, if there are deleted.
    // @TODO Check if parent tree exists. So this is a deletion to the next version.
    if (
      committedVisFile == null &&
      stagedVisFiles[0].status === STATUS_DELETED
    ) {
      this.stagingArea.fileList.remove(...stagedVisFiles);
    }

    return visFiles[0];
  }

  @action
  unstageFile(fileIndex) {
    const file = this.files[fileIndex];

    this.repo.unstageFile(file);

    // Get all files vis staged to the staging area. Get all in case user staged multiple times.
    const stagedVisFiles = this.stagingArea.filter(
      object => object.isFile && object.file === file,
    );

    // Move the first of these files back to the working directory.
    this.workingDirectory.fileList.add(stagedVisFiles[0]);

    // Remove the other ones, if needed.
    if (stagedVisFiles.length > 1) {
      this.stagingArea.fileList.remove(...stagedVisFiles);
    }

    return stagedVisFiles[0];
  }

  @action
  deleteFile(fileIndex) {
    const file = this.files[fileIndex];

    // Get all file vis for this file. Can be more because we create copies in the working directory.
    const visFiles = this.workingDirectory.filter(
      object => object.isFile && object.file === file,
    );

    // Remove the file if it is newly added.
    if (visFiles.length > 0 && visFiles[0].status === STATUS_ADDED) {
      this.workingDirectory.fileList.remove(...visFiles);
    }

    this.repo.workingDirectory.removeFile(file);

    return visFiles[0];
  }

  @action
  modifyFile(fileIndex) {
    // Done
    const file = this.files[fileIndex];

    if (file == null) {
      console.error('Missing file.');
      return;
    }

    file.modify();
    this.repo.workingDirectory.addFile(file);

    return this.workingDirectory.find(
      object => object.isFile && object.file === file,
    );
  }

  @action
  createBranch(branchName) {
    const branch = this.repo.createBranch(branchName);
    const visBranch = new BranchVisualisation(this, branch);

    this.repository.add(visBranch);

    return visBranch;
  }

  @action
  checkout(branchName) {
    this.repo.checkout(branchName);

    return this.head;
  }

  @action
  merge(branchName) {
    const branch = this.repo.merge(branchName);
    const commit = branch.commit;

    // Create a new commit vis
    const visCommit = new CommitVisualisation(this, commit);

    this.head.add(visCommit);

    // @TODO Ughh …
    setTimeout(
      action(() => {
        const visParentCommits = this.repository.visCommits.filter(visCommit =>
          commit.parents.includes(visCommit.commit),
        );

        // Look for a parent commit and merge the files into our new one.
        if (commit.parents.length > 0) {
          commit.parents.forEach(parent => {
            const parentVisCommit = this.repository.visCommits.find(
              visCommit => visCommit.commit === parent,
            );

            // Wait, do not copy previously deleted files.
            const parentVisFiles = parentVisCommit.filter(
              object => object.isFile && object.status !== STATUS_DELETED,
            );

            // Finally copy all the files from the parent commit into our new one.
            visCommit.add(
              ...parentVisFiles.map(
                parentVisFile =>
                  new FileVisualisation(
                    this,
                    parentVisFile.file,
                    parentVisFile,
                  ),
              ),
            );
          });
        }

        // Create new pointers
        for (let visParentCommit of visParentCommits) {
          const visPointer = new PointerVisualisation(
            this,
            visCommit,
            visParentCommit,
          );

          this.head.add(visPointer);
        }
      }),
      1000,
    );

    return this.head;
  }

  @action
  createCommit(message, prevVIsFile = true) {
    let visParentCommit;

    const commit = this.repo.createCommit(message);

    // Find parent commit to be able to create a pointer
    if (commit.parents.length > 0) {
      visParentCommit = this.repository.visCommits.find(
        visCommit => visCommit.commit === commit.parents[0],
      );
    }

    // Create a new commit vis
    const visCommit = new CommitVisualisation(this, commit);

    // Create a new pointer
    const visPointer = new PointerVisualisation(
      this,
      visCommit,
      visParentCommit,
    );

    // Move commit to repository
    this.head.add(visCommit, visPointer);

    // Move all the files from the staging area to the commit
    const stagedVisFiles = this.stagingArea.filter(object => object.isFile);
    visCommit.add(...stagedVisFiles);

    // Look for a parent commit and merge the files into our new one.
    if (commit.parents.length > 0) {
      commit.parents.forEach(parent => {
        const parentVisCommit = this.repository.visCommits.find(
          visCommit => visCommit.commit === parent,
        );

        // Wait, do not copy all the files! Only the one, not present in the staging area.
        const parentVisFiles = parentVisCommit.filter(
          object =>
            object.isFile &&
            object.status !== STATUS_DELETED &&
            !stagedVisFiles.some(
              stagedVisFile => stagedVisFile.file === object.file,
            ),
        );

        // Create copy of all the files in the parent commit
        for (let parentVisFile of parentVisFiles) {
          parentVisCommit.add(
            new FileVisualisation(
              this,
              parentVisFile.file,
              prevVIsFile ? parentVisFile : null,
            ),
          );
        }

        // Finally copy all the files from the parent commit into our new one.
        visCommit.add(...parentVisFiles);
      });
    }

    return visCommit;
  }

  @action
  revertCommit(commitIndex) {
    const visCommit = this.repository.visCommits[commitIndex];

    if (visCommit == null) {
      throw new Error('Missing commit!');
    }

    // We essentially reset to the parent before, due to simplified rules for this vis.
    // This is the first commit, so reset the working directory
    /*if (commit.parent == null) {
      this.workingDirectory.fileList.remove(...this.workingDirectory.fileList.files());

      return;
    }*/

    // Filter files inside the commit for changes
    let changedVisFiles = visCommit.filter(
      object =>
        object.isFile &&
        object.status !== STATUS_UNMODIFIED &&
        object.status !== STATUS_DELETED,
    );

    changedVisFiles = uniqBy(changedVisFiles, visFile => visFile.file);

    // Copy all changed files from the commit as visualisation backups.
    for (let changedVisFile of changedVisFiles) {
      visCommit.add(new FileVisualisation(this, changedVisFile.file));
    }

    // Move them into the working directory
    this.workingDirectory.fileList.add(...changedVisFiles);

    this.repo.revertCommit(visCommit.commit);

    return visCommit;
  }

  getStatus() {
    const status = { unstaged: [], staged: [], branch: this.repo.head.name };

    this.files.forEach(file => {
      const stagedVisFile = this.stagingArea.find(
        object =>
          object.isFile &&
          object.file === file &&
          object.status !== STATUS_UNMODIFIED,
      );

      if (stagedVisFile != null) {
        status.staged.push({
          visFile: stagedVisFile,
          status: stagedVisFile.status,
        });

        return;
      }

      const unstagedVisFile = this.workingDirectory.find(
        object =>
          object.isFile &&
          object.file === file &&
          object.status !== STATUS_UNMODIFIED,
      );

      if (unstagedVisFile != null) {
        status.unstaged.push({
          visFile: unstagedVisFile,
          status: unstagedVisFile.status,
        });

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

  return react`${padEnd(status, FILE_STATUS_SPACES)}${(
    <VisualisationFileReference
      key={file.visFile.id}
      vis={vis}
      file={file.visFile}
    />
  )}`;
}

function createStagedStatus(vis, staged) {
  return react`Changes to be committed:${staged.map(
    file => react`\n${createFileStatus(vis, file)}`,
  )}`;
}

function createUnstagedStatus(vis, unstaged) {
  return react`Changes not staged for commit:${unstaged.map(
    file => react`\n${createFileStatus(vis, file)}`,
  )}`;
}

export function createStatusMessage(vis, status) {
  if (status.staged == null && status.unstaged == null) {
    return 'Nothing to commit, working tree clean.';
  }

  return react`${
    status.staged != null ? createStagedStatus(vis, status.staged) : ''
  }${status.staged != null && status.unstaged != null ? '\n\n' : ''}${
    status.unstaged != null ? createUnstagedStatus(vis, status.unstaged) : ''
  }`;
}

function createCommitDiff(visCommit) {
  const visFiles = visCommit.filter(
    object => object.isFile && object.status !== STATUS_UNMODIFIED,
  );

  const diff = visFiles.reduce(
    (diff, visFile) => {
      diff.added = visFile.diff.added;
      diff.removed = visFile.diff.removed;

      return diff;
    },
    { added: 0, removed: 0 },
  );

  return `${visFiles.length} file${visFiles.length !== 1 ? 's' : ''} changed, ${
    diff.added
  } insertions(+), ${diff.removed} deletions(-)`;
}

export function createCommitMessage(vis, visCommit) {
  return react`[master ${(
    <VisualisationCommitReference
      key={visCommit.id}
      vis={vis}
      commit={visCommit}
    />
  )}] ${visCommit.commit.message}
${createCommitDiff(visCommit)}
`;
}

export function createCheckoutMessage(vis, visBranch) {
  return react`Switched to branch '${visBranch.branch.name}'`;
}

export function createMergeMessage(vis, visBranch) {
  const references = visBranch.lastVisCommit.commit.parents
    .map(commit =>
      vis.repository.visCommits.find(visCommit => visCommit.commit === commit),
    )
    .map(visCommit => (
      <VisualisationCommitReference
        key={visCommit.id}
        vis={vis}
        commit={visCommit}
      />
    ));

  return react`Merged ${references[0]} and ${references[1]}.`;
}

export default GitVisualisation;
