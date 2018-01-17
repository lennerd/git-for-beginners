import React, { Fragment } from "react";
import { extendObservable, computed, action } from 'mobx';

import { createChapter } from "./Chapter";
import { ChapterText, ChapterTask } from "./ChapterSection";
import Tooltip from "../components/Tooltip";
import Visualisation from "./Visualisation";
import VisualisationArea from "./VisualisationArea";
import VisualisationFileList from "./VisualisationFileList";
import VisualisationFile from "./VisualisationFile";
import { STATUS_MODIFIED } from "../constants";
import ConsoleCommand from "./ConsoleCommand";
import { createAction } from "./Action";

const addFile = createAction('ADD_FILE');

const versioningInGitChapter = createChapter('Versioning in Git', {
  get vis() {
    const vis = new Visualisation();

    const workingDirectory = new VisualisationArea();
    workingDirectory.name = 'Working Directory';

    const stagingArea = new VisualisationArea();
    stagingArea.name = 'Staging Area';
    stagingArea.column = 1;

    const repository = new VisualisationArea();
    repository.name = 'Repository';
    repository.column = 2;
    repository.height = 10;
    repository.width = 4;

    const workingDirectoryFileList = new VisualisationFileList();

    workingDirectoryFileList.files.push(
      new VisualisationFile(),
      new VisualisationFile(),
      new VisualisationFile(),
    );

    workingDirectoryFileList.files.forEach((file, index) => {
      file.level = index;
      file.status = STATUS_MODIFIED;
      file.modify();
    });

    extendObservable(vis, {
      areas: computed(() => {
        return [
          workingDirectory,
          stagingArea,
          repository,
        ];
      }),
      fileLists: computed(() => {
        const fileLists = [
          workingDirectoryFileList
        ];

        return fileLists;
      }),
    });

    return vis;
  },
  get sections() {
    return [
      new ChapterText(() => (
        <Fragment>
          Let’s take a look at how a <Tooltip name="commit">commit</Tooltip> is created.
        </Fragment>
      )),
      new ChapterTask(() => <Fragment>Add some or all files to the <Tooltip name="stagingArea">staging area</Tooltip>.</Fragment>),
      new ChapterText(() => (
        <Fragment>
          Did you see how files moved from the <Tooltip name="workingDirectory">working directory</Tooltip> to the staging area? The staging area can be used to select changes you want to be part of the next version, the next commit.
        </Fragment>
      ), { skip: true }),
      new ChapterTask(() => 'Create a new commit.'),
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
      new ConsoleCommand('File', {
        available: this.vis.activeFile != null,
        commands: [
          new ConsoleCommand('Stage', {
            icon: '↗',
            message: 'File was added to the staging area.',
            run: this.copyFile,
          }),
          new ConsoleCommand('Delete', {
            icon: '×',
            message: 'File was deleted.',
            run: this.deleteFile,
          }),
        ],
      }),
      new ConsoleCommand('Add new file.', {
        icon: '+',
        available: this.vis.activeFile == null,
        message: 'A new file was added.',
        run: this.addFile,
      }),
    ];
  }
});

export default versioningInGitChapter;
