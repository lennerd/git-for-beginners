import React, { Fragment } from 'react';

import { createChapter, init } from '../Chapter';
import { ChapterText } from '../ChapterSection';
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

const sandboxChapter = createChapter('Git Sandbox', {
  inheritFrom: 'Git Branches',
  get sections() {
    return [
      new ChapterText(() => (
        <Fragment>
          This is the end of your journey through Git. You just learned the
          basics about versioning and Git, the console, how to do versioning in
          a team and how to use all these concepts together. Isn‘t that amazing?
          I hope it was easy to understand and you liked it!
        </Fragment>
      )),
      new ChapterText(() => (
        <Fragment>
          One more thing: the sandbox mode. Use the <code>tutorial</code>{' '}
          command to create new files or modify selected ones. Use the{' '}
          <code>git</code> command to stage files, create commits or branches
          and merge branches together. Don‘t forget (and I can‘t stress this
          often enough):
        </Fragment>
      )),
      new ChapterText(
        () => (
          <em>
            This is your own sandbox looking forward to be used and explored!
            Happy Gitting!
          </em>
        ),
        {
          skip: true,
        },
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
    if (message == null) {
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

export default sandboxChapter;
