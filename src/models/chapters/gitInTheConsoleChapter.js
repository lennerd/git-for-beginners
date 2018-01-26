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
const createCommit = createAction('CREATE_COMMIT');
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
      new ChapterText(() => (
        <Fragment>
          Let’s create a few more <Tooltip name="commit">commits</Tooltip>. This
          time we use the console.
        </Fragment>
      )),
      new ChapterTask(
        () => (
          <Fragment>
            First create a new file or modify an existing one like in the
            chapters before.
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
              The normal console won’t give you the visualisation you have here.
              No worries though. With <code>git status</code> you are able to
              see similar text based output.
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
              Do not forget to add quotes in front of and behind your message to
              signal a complete string.{' '}
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
            Wow, that wasn’t so difficult right? The console is nothing more
            than before. A text based menu of options with a nice history of
            what you have done before.{' '}
            <em>Again you are free to explore and play around.</em>
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterText(
        () => (
          <Fragment>
            Let‘s look at one final topic, where Git can really help you out.
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
      new ConsoleCommand('git add', {
        textOnly: true,
        action: stageFile,
        payloadCreator: () => this.activeFileIndex,
      }),
      new ConsoleCommand('git status', {
        textOnly: true,
        message: ({ data }) => <pre>{createStatusMessage(this.vis, data)}</pre>,
        action: getStatus,
      }),
      new ConsoleCommand('git commit', {
        textOnly: true,
        message: ({ data }) => <pre>{createCommitMessage(this.vis, data)}</pre>,
        action: createCommit,
        payloadCreator: () => this.activeFileIndex,
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

export default gitInTheConsoleChapter;
