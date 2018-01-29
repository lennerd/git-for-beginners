import React, { Fragment } from 'react';

import { createChapter, init } from '../Chapter';
import { ChapterText, ChapterTask } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';
import Console from '../Console';
import { VisualisationFileReference } from '../../components/VisualisationObjectReference';
import ConsoleCommand from '../ConsoleCommand';
import { createAction } from '../Action';
import {
  createStatusMessage,
  createCommitMessage,
} from '../vis/GitVisualisation';
import { STATUS_UNMODIFIED } from '../../constants';
import ConsoleError from '../ConsoleError';

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
const getStatus = createAction('GET_STATUS');
const createCommit = createAction('CREATE_COMMIT', args => {
  return args.m || args.message;
});
const modifyFile = createAction('MODIFY_FILE');
const deleteFile = createAction('DELETE_FILE');

const gitInTheConsoleChapter = createChapter('Git in the Console', {
  inheritFrom: 'Versioning in Git',
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
  get hasModifiedFiles() {
    return this.vis.workingDirectory.some(
      object => object.isFile && object.status !== STATUS_UNMODIFIED,
    );
  },
  get hasFiledStaged() {
    return this.vis.stagingArea.some(object => object.isFile);
  },
  get hasCreatedCommit() {
    return this.state.has(createCommit);
  },
  get sections() {
    return [
      new ChapterText(
        () => (
          <Fragment>
            Let’s create a few more <Tooltip name="commit">commits</Tooltip>.
            This time we use the <Tooltip name="console">console</Tooltip>. Two
            commands are available: <code>tutorial</code> and <code>git</code>
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            First create a new file with <code>tutorial add</code> <em>or</em>{' '}
            select a file and modify it via <code>tutorial modify</code>.
          </Fragment>
        ),
        this.hasModifiedFiles || this.hasFiledStaged || this.hasCreatedCommit,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Select a file and use <code>git add</code> to add it to the{' '}
            <Tooltip name="stagingArea">staging area</Tooltip>.
          </Fragment>
        ),
        this.hasFiledStaged || this.hasCreatedCommit,
        {
          tip: () => (
            <Fragment>
              The normal console won’t give you the visualisation you see here.
              But that’s fine. With <code>git status</code> you are able to see
              the similar text based output.
            </Fragment>
          ),
        },
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Create a new commit via <code>git commit -m "Your message"</code>.
          </Fragment>
        ),
        this.hasCreatedCommit,
        {
          tip: () => (
            <Fragment>
              <code>-m</code> is short for <code>--message</code>. Do not forget
              to add quotes in front of and behind your message to signal a
              complete string.{' '}
              <em>
                Use the message string to summarize your changes to others.
              </em>
            </Fragment>
          ),
        },
      ),
      new ChapterText(
        () => (
          <Fragment>
            Wow, that wasn’t difficult, was it? The console isn’t anything else
            than the menu before. A text based menu of options with a nice
            history of what you have done before.{' '}
            <em>Again you are free to explore and play around.</em>
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterText(
        () => (
          <Fragment>
            Let‘s look at the final topic and see what else Git can do for you.
          </Fragment>
        ),
        { skip: true },
      ),
    ];
  },
  get vis() {
    return this.parent.vis;
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
  [createCommit](message) {
    if (message == null) {
      throw new ConsoleError('Please provide a message.');
    }

    return this.vis.createCommit(message);
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

export default gitInTheConsoleChapter;
