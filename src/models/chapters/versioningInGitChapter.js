import React, { Fragment } from 'react';

import { createChapter, init } from '../Chapter';
import { ChapterText, ChapterTask } from '../ChapterSection';
import Tooltip from '../../components/Tooltip';
import ConsoleCommand from '../ConsoleCommand';
import { createAction } from '../Action';
import {
  VisualisationCommitReference,
  VisualisationFileReference,
} from '../../components/VisualisationObjectReference';
import Console from '../Console';
import Repository from '../Repository';
import GitVisualisation from '../vis/GitVisualisation';
//import File from "../File";

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
//const stageAllFiles = createAction('STAGE_ALL_FILES');
const unstageFile = createAction('UNSTAGE_FILE');
const deleteFile = createAction('DELETE_FILE');
const createCommit = createAction('CREATE_COMMIT');
const modifyFile = createAction('MODIFY_FILE');
const revertCommit = createAction('REVERT_COMMIT');

const versioningInGitChapter = createChapter('Versioning in Git', {
  head: null,
  get hasRevertedCommit() {
    return this.state.has(revertCommit);
  },
  get activeFile() {
    const activeVisFile = this.vis.visFiles.find(visFile => visFile.active);

    if (activeVisFile == null) {
      return null;
    }

    return activeVisFile.file;
  },
  get activeFileIndex() {
    return this.vis.files.indexOf(this.activeFile);
  },
  get activeVisCommit() {
    return this.vis.repository.visCommits.find(visCommit => visCommit.active);
  },
  get activeVisCommitIndex() {
    return this.vis.repository.visCommits.indexOf(this.activeVisCommit);
  },
  [init]() {
    this.repo = new Repository();
    this.vis = new GitVisualisation(this.repo);
    this.console = new Console();

    this.console.add(
      /*new ConsoleCommand('Working Directory', {
        available: () => this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('Stage all files.', {
            icon: '↗',
            message: () => 'All files were added to the staging area.',
            action: stageAllFiles,
          }),
        ],
      }),*/
      new ConsoleCommand('Working Directory', {
        available: () =>
          this.activeFile == null || this.vis.workingDirectory.active,
        commands: [
          new ConsoleCommand('Add new file.', {
            icon: '+',
            message: ({ data }) => {
              return (
                <Fragment>
                  A new file{' '}
                  <VisualisationFileReference vis={this.vis} file={data} /> was
                  added.
                </Fragment>
              );
            },
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
          new ConsoleCommand('Stage', {
            available: () => this.activeFile != null,
            icon: '↗',
            message: ({ data }) => (
              <Fragment>
                File <VisualisationFileReference vis={this.vis} file={data} />{' '}
                was added to the staging area.
              </Fragment>
            ),
            action: stageFile,
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
      new ConsoleCommand('Staging Area', {
        available: () => this.vis.stagingArea.active,
        commands: [
          new ConsoleCommand('Create commit', {
            icon: '↗',
            message: ({ data }) => (
              <Fragment>
                New commit{' '}
                <VisualisationCommitReference vis={this.vis} commit={data} />{' '}
                was stored in the repository.
              </Fragment>
            ),
            action: createCommit,
          }),
        ],
      }),
      new ConsoleCommand('File', {
        available: () => this.vis.stagingArea.active,
        commands: [
          new ConsoleCommand('Unstage', {
            icon: '↙',
            message: ({ data }) => (
              <Fragment>
                File <VisualisationFileReference vis={this.vis} file={data} />{' '}
                was removed from the staging area.
              </Fragment>
            ),
            action: unstageFile,
            payloadCreator: () => this.activeFileIndex,
          }),
        ],
      }),
      new ConsoleCommand('Repository', {
        available: () => this.vis.repository.active,
        commands: [
          new ConsoleCommand('Revert commit', {
            icon: '↙',
            message: ({ data }) => (
              <Fragment>
                Commit{' '}
                <VisualisationCommitReference vis={this.vis} commit={data} />{' '}
                was revereted successfully.
              </Fragment>
            ),
            action: revertCommit,
            payloadCreator: () => this.activeVisCommitIndex,
          }),
        ],
      }),
    );
  },
  [addFile]() {
    return this.vis.addFile();
  },
  [stageFile](fileIndex) {
    return this.vis.stageFile(fileIndex);
  },
  [unstageFile](fileIndex) {
    return this.vis.unstageFile(fileIndex);
  },
  [deleteFile](fileIndex) {
    return this.vis.deleteFile(fileIndex);
  },
  [modifyFile](fileIndex) {
    return this.vis.modifyFile(fileIndex);
  },
  [createCommit]() {
    return this.vis.createCommit();
  },
  [revertCommit](commitIndex) {
    return this.vis.revertCommit(commitIndex);
  },
  get sections() {
    return [
      new ChapterText(() => (
        <Fragment>
          Let’s have a look at how a <Tooltip name="commit">commit</Tooltip> is
          created.
        </Fragment>
      )),
      new ChapterTask(
        () => (
          <Fragment>
            Add new files to the{' '}
            <Tooltip name="workingDirectory">working directory</Tooltip>.
          </Fragment>
        ),
        this.vis.workingDirectory.fileList.files.length > 0 ||
          this.vis.repository.visCommits.length > 0,
      ),
      new ChapterTask(
        () => (
          <Fragment>
            Stage the new files to add them to the{' '}
            <Tooltip name="stagingArea">staging area</Tooltip>.
          </Fragment>
        ),
        this.vis.stagingArea.fileList.files.length > 0 ||
          this.vis.repository.visCommits.length > 0,
      ),
      new ChapterText(
        () => (
          <Fragment>
            Did you see files moving over from the{' '}
            <Tooltip name="workingDirectory">working directory</Tooltip> to the
            staging area? These changed files will be part of your next version,
            your next commit.{' '}
            <em>
              You can add more files as you like it. The stage is yours,
              actually.
            </em>
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => 'Create a new commit.',
        this.vis.repository.visCommits.length > 0,
      ),
      new ChapterText(
        () => (
          <Fragment>
            Perfectly done. A new commit was created and added to the{' '}
            <Tooltip name="repository">repository</Tooltip>. As we said each
            commit has a unique identifier, as it can be seen in the interactive
            menu below the visualisation.
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => 'Create at least two more commits.',
        this.vis.repository.visCommits.length > 2,
        {
          tip: () => 'If you like you can also add, remove or modify files.',
        },
      ),
      new ChapterText(
        () => (
          <Fragment>
            Now as we have a few more versions of our project, let’s have a look
            at how to restore an older version.
          </Fragment>
        ),
        { skip: true },
      ),
      new ChapterTask(
        () => 'Revert changes from a commit.',
        this.hasRevertedCommit,
      ),
      new ChapterText(
        () => (
          <Fragment>
            Well done! A few commits were created and an older version of your
            project restored.{' '}
            <em>
              Go ahead and play around with your Git powered project a little
              more.
            </em>{' '}
            Or jump directly to the …
          </Fragment>
        ),
        { skip: true },
      ),
    ];
  },
});

export default versioningInGitChapter;
