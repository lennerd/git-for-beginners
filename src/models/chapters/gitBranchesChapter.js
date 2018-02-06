import React, { Fragment } from 'react';

import { createChapter, init } from '../Chapter';
import { ChapterText, ChapterTask } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';
import Console from '../Console';
import { VisualisationFileReference } from '../../components/VisualisationObjectReference';
import ConsoleCommand from '../ConsoleCommand';
import {
  createStatusMessage,
  createCommitMessage,
  createCheckoutMessage,
  createMergeMessage,
} from '../vis/GitVisualisation';
import { createAction } from '../Action';
import ConsoleError from '../ConsoleError';

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
const getStatus = createAction('GET_STATUS');
const createCommit = createAction('CREATE_COMMIT', args => {
  return args.m || args.message;
});
const modifyFile = createAction('MODIFY_FILE');
const deleteFile = createAction('DELETE_FILE');
const createBranch = createAction('CREATE_BRANCH', args => {
  return args._[0];
});
const checkoutBranch = createAction('CHECKOUT_BRANCH', args => {
  return args._[0];
});
const mergeBranch = createAction('MERGE_BRANCH', args => {
  return args._[0];
});

const gitBranchesChapter = createChapter('Git Branches', {
  inheritFrom: 'Git in the Console',
  get newBranch() {
    if (this.vis.repo.branches.length === 1) {
      return null; // Only master
    }

    return this.vis.repo.branches[this.vis.repo.branches.length - 1];
  },
  get newVisBranch() {
    if (this.newBranch == null) {
      return null;
    }

    return this.vis.visBranches.find(
      visBranch => visBranch.branch === this.newBranch,
    );
  },
  get newVisBranchHasCommits() {
    if (this.newVisBranch == null) {
      return false;
    }

    return this.newVisBranch.visCommits.length > 0;
  },
  get visMasterBranch() {
    return this.vis.visBranches.find(
      visBranch => visBranch.branch.name === 'master',
    );
  },
  get visMasterBranchHasCommits() {
    return this.visMasterBranchCommits.length > 0;
  },
  get visNewBranchWasMerged() {
    if (this.newVisBranch == null) {
      return false;
    }

    return this.state
      .filter(mergeBranch)
      .some(action => action.payload === this.newVisBranch.branch.name);
  },
  get sections() {
    return [
      new ChapterText(
        () => (
          <Fragment>
            Let’s repeat it, i.e. using the{' '}
            <Tooltip name="console">console</Tooltip> again.
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Create a new <Tooltip name="branch">branch</Tooltip> with{' '}
            <code>git branch new-branch</code>
          </Fragment>
        ),
        this.newVisBranch != null,
        {
          tip: () => (
            <Fragment>
              You can replace the name <code>new-branch</code> by any name you
              like.{' '}
              <em>
                Keep in mind that good branch names help you to organize the
                work in your team.
              </em>
            </Fragment>
          ),
        },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Check out your <code>{this.newVisBranch.branch.name}</code> branch
            with <code>git checkout {this.newVisBranch.branch.name}</code> to
            activate it.
          </Fragment>
        ),
        this.newVisBranch === this.vis.head || this.newVisBranchHasCommits,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Create one or more new <Tooltip name="commit">commits</Tooltip>.
          </Fragment>
        ),
        this.newVisBranchHasCommits,
        {
          tip: () => (
            <Fragment>
              Use the previous <code>tutorial</code> command to modify selected
              files or create new ones. Use the <code>git</code> command to add
              files to the staging area or to create new commits.
            </Fragment>
          ),
        },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Checkout the <code>master</code> branch.
          </Fragment>
        ),
        this.visMasterBranch === this.vis.head ||
          this.visMasterBranchHasCommits ||
          this.visNewBranchWasMerged,
      ),
      new ChapterTask(
        () => <Fragment>Create one or more new commits.</Fragment>,
        this.visMasterBranchHasCommits,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Use <code>git merge {this.newVisBranch.branch.name}</code> to merge{' '}
            <code>{this.newVisBranch.branch.name}</code> into{' '}
            <code>master</code>.
          </Fragment>
        ),
        this.visNewBranchWasMerged, // True as soon as new branch was merged into master
      ),
      new ChapterText(
        () => (
          <Fragment>
            Voilà, you just created a new branch as well as a bunch of commits
            and merged these commits from both branches into a single one. I
            would say you’re ready for using Git in a team, aren’t you?
          </Fragment>
        ),
        { skip: true },
      ),
    ];
  },
  get vis() {
    return this.parent.vis;
  },
  get activeVisFile() {
    return this.vis.visFiles.find(visFile => visFile.active);
  },
  get activeFile() {
    if (this.activeVisFile == null) {
      return null;
    }

    return this.activeVisFile.file;
  },
  get activeFileIndex() {
    return this.vis.files.indexOf(this.activeFile);
  },
  [init]() {
    this.vis.showBranches = true;
    this.console = new Console({
      payloadElement: () => {
        if (this.vis.workingDirectory.active && this.activeVisFile != null) {
          return (
            <VisualisationFileReference
              vis={this.vis}
              file={this.activeVisFile}
            />
          );
        }

        return null;
      },
    });

    this.console.add(
      new ConsoleCommand('git', {
        textOnly: true,
        commands: [
          new ConsoleCommand('add', {
            textOnly: true,
            action: stageFile,
            payloadCreator: () => this.activeFileIndex,
            message: ({ data }) => (
              <Fragment>
                File <VisualisationFileReference vis={this.vis} file={data} />{' '}
                was added to the staging area.
              </Fragment>
            ),
          }),
          new ConsoleCommand('status', {
            textOnly: true,
            message: ({ data }) => (
              <pre>{createStatusMessage(this.vis, data)}</pre>
            ),
            action: getStatus,
          }),
          new ConsoleCommand('commit', {
            textOnly: true,
            message: ({ data }) => (
              <pre>{createCommitMessage(this.vis, data)}</pre>
            ),
            action: createCommit,
          }),
          new ConsoleCommand('branch', {
            textOnly: true,
            action: createBranch,
          }),
          new ConsoleCommand('checkout', {
            textOnly: true,
            message: ({ data }) => (
              <pre>{createCheckoutMessage(this.vis, data)}</pre>
            ),
            action: checkoutBranch,
          }),
          new ConsoleCommand('merge', {
            textOnly: true,
            message: ({ data }) => (
              <pre>{createMergeMessage(this.vis, data)}</pre>
            ),
            action: mergeBranch,
          }),
        ],
      }),
      new ConsoleCommand('tutorial', {
        textOnly: true,
        available: () => this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('add', {
            textOnly: true,
            message: ({ data }) => (
              <Fragment>
                A new file{' '}
                <VisualisationFileReference vis={this.vis} file={data} /> was
                added.
              </Fragment>
            ),
            action: addFile,
          }),
          new ConsoleCommand('modify', {
            textOnly: true,
            available: () => this.activeFile != null,
            message: ({ data }) => (
              <Fragment>
                File <VisualisationFileReference vis={this.vis} file={data} />{' '}
                was modified.
              </Fragment>
            ),
            action: modifyFile,
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('delete', {
            textOnly: true,
            available: () => this.activeFile != null,
            message: ({ data }) => (
              <Fragment>
                File <VisualisationFileReference vis={this.vis} file={data} />{' '}
                was deleted.
              </Fragment>
            ),
            action: deleteFile,
            payloadCreator: () => this.activeFileIndex,
          }),
        ],
      }),
    );
  },
  [addFile]() {
    return this.vis.addFile();
  },
  [stageFile](fileIndex) {
    if (fileIndex < 0) {
      throw new ConsoleError('You need to select a file you want to stage.');
    }

    return this.vis.stageFile(fileIndex);
  },
  visMasterBranchCommits: [],
  [createCommit](message) {
    if (typeof message !== 'string' || message === '') {
      throw new ConsoleError('Please provide a message.');
    }

    const visCommit = this.vis.createCommit(message);

    if (this.newVisBranchHasCommits && this.visMasterBranch === this.vis.head) {
      this.visMasterBranchCommits.push(visCommit);
    }

    return visCommit;
  },
  [getStatus]() {
    return this.vis.getStatus();
  },
  [deleteFile](fileIndex) {
    return this.vis.deleteFile(fileIndex);
  },
  [modifyFile](fileIndex) {
    return this.vis.modifyFile(fileIndex);
  },
  [createBranch](branchName) {
    if (branchName == null || branchName === '') {
      throw new ConsoleError('Please provide a branch name.');
    }

    return this.vis.createBranch(branchName);
  },
  [checkoutBranch](branchName) {
    if (branchName == null || branchName === '') {
      throw new ConsoleError('Please provide a branch name.');
    }

    return this.vis.checkout(branchName);
  },
  [mergeBranch](branchName) {
    if (branchName == null || branchName === '') {
      throw new ConsoleError('Please provide a branch name.');
    }

    return this.vis.merge(branchName);
  },
});

export default gitBranchesChapter;
