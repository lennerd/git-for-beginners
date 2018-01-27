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
  createBranchMessage,
  createCheckoutMessage,
  createMergeMessage,
} from '../vis/GitVisualisation';
import { createAction } from '../Action';
import ConsoleError from '../ConsoleError';

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
const getStatus = createAction('GET_STATUS');
const createCommit = createAction('CREATE_COMMIT');
const modifyFile = createAction('MODIFY_FILE');
const deleteFile = createAction('DELETE_FILE');
const createBranch = createAction('CREATE_BRANCH');
const checkoutBranch = createAction('CHECKOUT_BRANCH');
const mergeBranch = createAction('MERGE_BRANCH');

const gitBranchesChapter = createChapter('Git Branches', {
  inheritFrom: 'Git in the Console',
  get sections() {
    return [
      new ChapterText(
        () => (
          <Fragment>
            Let’s do this again. This time again with using the{' '}
            <Tooltip name="console">console</Tooltip>.
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
        true,
        {
          tip: () => (
            <Fragment>
              You can replace the name <code>new-branch</code> with what ever
              you like.{' '}
              <em>
                Keep in mind though that good branch names can help organize the
                work in your team.
              </em>
            </Fragment>
          ),
        },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Check out your <code>new-branch</code> branch with{' '}
            <code>git checkout new-branch</code> to activate it.
          </Fragment>
        ),
        true,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Create one or more new <Tooltip name="commit">commits</Tooltip>.
          </Fragment>
        ),
        true,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Checkout the <code>master</code> branch.
          </Fragment>
        ),
        true,
      ),
      new ChapterTask(
        () => <Fragment>Create one or more new commits.</Fragment>,
        true,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Use <code>git merge new-branch</code> to merge{' '}
            <code>new-branch</code> into <code>master</code>.
          </Fragment>
        ),
        true,
      ),
      new ChapterText(
        () => (
          <Fragment>
            Voilà, you just created a new branch, a bunch of commits and merged
            these commits into a single one. I would say you are ready for using
            Git in a team, aren’t you?
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterText(
        () => (
          <Fragment>
            We also have reached the end of this tutorial. You just learned the
            basics about versioning and git, the console, how to do versioning
            in a team and how to use all these concepts together. Crazy. I hope
            everything was understandable and you had fun! Keep in mind (and I
            can’t say it often enough):
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterText(
        () => (
          <em>This is your personal sandbox, ready to be used and explored!</em>
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
  get activeVisCommit() {
    return this.vis.repository.visCommits.find(visCommit => visCommit.active);
  },
  get activeCommit() {
    if (this.activeVisCommit == null) {
      return null;
    }

    return this.activeVisCommit.commit;
  },
  [init]() {
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
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('branch', {
            textOnly: true,
            message: ({ data }) => (
              <pre>{createBranchMessage(this.vis, data)}</pre>
            ),
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
      new ConsoleCommand('Working Directory', {
        available: () => this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('Add new file.', {
            icon: '+',
            message: ({ data }) => (
              <Fragment>
                A new file{' '}
                <VisualisationFileReference vis={this.vis} file={data} /> was
                added.
              </Fragment>
            ),
            action: addFile,
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: () => this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('Modify', {
            available: () => this.activeFile != null,
            icon: '+-',
            message: ({ data }) => (
              <Fragment>
                File <VisualisationFileReference vis={this.vis} file={data} />{' '}
                was modified.
              </Fragment>
            ),
            action: modifyFile,
            payloadCreator: () => this.activeFileIndex,
          }),
          new ConsoleCommand('Delete', {
            available: () => this.activeFile != null,
            icon: '×',
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
  [createCommit]() {
    return this.vis.createCommit();
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
});

export default gitBranchesChapter;
