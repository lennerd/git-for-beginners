import React, { Fragment } from "react";
import { computed } from 'mobx';

import { createChapter, init } from "../Chapter";
import { ChapterText, ChapterTask } from "../ChapterSection";
import Tooltip from "../../components/Tooltip";
import Visualisation from "../Visualisation";
import VisualisationArea from "../VisualisationArea";
import VisualisationFileList from "../VisualisationFileList";
import VisualisationFile from "../VisualisationFile";
import { STATUS_MODIFIED, STATUS_DELETED } from "../../constants";
import ConsoleCommand from "../ConsoleCommand";
import { createAction } from "../Action";
import VisualisationCommit from "../VisualisationCommit";
import VisualisationStagingArea from "../VisualisationStagingArea";
import VisualisationRepository from "../VisualisationRepository";

const addFile = createAction('ADD_FILE');
const stageFile = createAction('STAGE_FILE');
const unstageFile = createAction('UNSTAGE_FILE');
const deleteFile = createAction('DELETE_FILE');
const createCommit = createAction('CREATE_COMMIT');

const versioningInGitChapter = createChapter('Versioning in Git', {
  get activeFile() {
    return this.vis.files[this.activeFileIndex];
  },
  get activeFileIndex() {
    return this.vis.files.findIndex(file => file.active);
  },
  [init]() {
    this.vis = new Visualisation();

    this.workingDirectoryFileList = new VisualisationFileList();
    this.stagingAreaFileList = new VisualisationCommit();

    this.workingDirectory = new VisualisationArea('Working Directory');
    this.workingDirectory.add(this.workingDirectoryFileList);

    this.stagingArea = new VisualisationStagingArea();
    this.stagingArea.column = 1;
    this.stagingArea.add(this.stagingAreaFileList);

    this.repository = new VisualisationRepository();
    this.repository.column = 2;
    this.repository.height = 10;
    this.repository.width = 4;

    this.vis.add(
      this.workingDirectory,
      this.stagingArea,
      this.repository,
    );

    const files = [
      new VisualisationFile(),
      new VisualisationFile(),
      new VisualisationFile()
    ];

    files.forEach(file => {
      file.status = STATUS_MODIFIED;
      file.modify();
    });

    this.workingDirectoryFileList.add(
      ...files
    );
  },
  [addFile]() {
    const file = new VisualisationFile();

    this.workingDirectoryFileList.add(file);
  },
  [stageFile](fileIndex) {
    const file = this.vis.files[fileIndex];

    this.stagingAreaFileList.add(file);
  },
  [unstageFile](fileIndex) {
    const file = this.vis.files[fileIndex];

    this.workingDirectoryFileList.add(file);
  },
  [deleteFile](fileIndex) {
    this.vis.files[fileIndex].status = STATUS_DELETED;
  },
  [createCommit]() {
    const commit = new VisualisationCommit()

    commit.add(...this.stagingAreaFileList.files);

    this.repository.add(commit);
  },
  get sections() {
    return [
      new ChapterText(() => (
        <Fragment>
          Let’s take a look at how a <Tooltip name="commit">commit</Tooltip> is created.
        </Fragment>
      )),
      new ChapterTask(() => (
        <Fragment>Add files to the <Tooltip name="stagingArea">staging area</Tooltip>.</Fragment>
      ), this.stagingAreaFileList.files.length > 0 || this.repository.commits.length > 0),
      new ChapterText(() => (
        <Fragment>
          Did you see how files moved from the <Tooltip name="workingDirectory">working directory</Tooltip> to the staging area? These files changes are ready to be part of the next version, the next commit. <em>You can add more files, if you want. The stage is yours, actually.</em>
        </Fragment>
      ), { skip: true }),
      new ChapterTask(() => 'Create a new commit.', this.repository.commits.length > 0),
      new ChapterText(() => (
        <Fragment>
          Perfect. A new commit was created and added to the <Tooltip name="repository">repository</Tooltip>. Like we said, each commit has a unique identifier, so we can reference it for example in the interactive menu below the visualisation.
        </Fragment>
      ), { skip: true }),
      new ChapterTask(() => 'Restore a commit.'),
      new ChapterText(() => 'Quite nice, right? Changes from a previous version were restored.', { skip: true }),
    ];
  },
  get commands() {
    return [
      new ConsoleCommand('Unstaged File', {
        available: computed(() => this.workingDirectory.has(this.activeFile)),
        commands: [
          new ConsoleCommand('Stage', {
            icon: '↗',
            message: 'File was added to the staging area.',
            run: () => this.dispatch(stageFile(this.activeFileIndex)),
          }),
          new ConsoleCommand('Delete', {
            icon: '×',
            message: 'File was deleted.',
            run: () => this.dispatch(deleteFile(this.activeFileIndex)),
          }),
        ],
      }),
      new ConsoleCommand('Staged File', {
        available: computed(() => this.stagingArea.has(this.activeFile)),
        commands: [
          new ConsoleCommand('Unstage', {
            icon: '↙',
            message: 'File was removed from the staging area.',
            run: () => this.dispatch(unstageFile(this.activeFileIndex)),
          }),
        ],
      }),
      new ConsoleCommand('Staging Area', {
        available: computed(() => this.stagingAreaFileList.active),
        commands: [
          new ConsoleCommand('Create commit', {
            icon: '↗',
            message: 'New commit was stored in the repository.',
            run: () => this.dispatch(createCommit()),
          }),
        ],
      }),
      new ConsoleCommand('Add new file.', {
        icon: '+',
        available: computed(() => this.activeFile == null),
        message: 'A new file was added.',
        run: () => this.dispatch(addFile()),
      }),
    ];
  }
});

export default versioningInGitChapter;
