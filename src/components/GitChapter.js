import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { extendObservable, action, observe, computed } from 'mobx';

import { ChapterText } from '../models/ChapterSection';
import TutorialChapter from './TutorialChapter';
import VisualisationArea from './VisualisationArea';
import VisualisationAreaName from './VisualisationAreaName';
import Visualisation from './Visualisation';
import Tooltip from './Tooltip';
import VisualisationFileModel from '../models/VisualisationFile';
import VisualisationFile from './VisualisationFile';
import VisualisationFileStatus from './VisualisationFileStatus';
import { STATUS_MODIFIED } from '../constants';

const SECTIONS = [
  new ChapterText(
    () => (
      <Fragment>
        Git is a version control system. It’s a software you can install on your computer to store <Tooltip name="version">versions</Tooltip> of your file. But instead of copying files and folders by hand, you store new snapshots of your whole project.'
      </Fragment>
    ),
    { skip: true }
  ),
  new ChapterText(() => 'Let’s take a look at the different parts of Git.'),
  new ChapterText(() => (
    <Fragment>
      First, there is the <strong>Working Directory</strong>, the folder on your computer where all the files and folders of your project are stored in. Here you add, modify or delete files with other software like you are used to.
    </Fragment>
  )),
  new ChapterText(() => (
    <Fragment>
      The second part is the <strong>Staging Area</strong>. Despite its name, it‘s not about showing something to others, but instead collect changes to your project you want to be part of your next version. This way you are able to group changes into seperate version, e.g. by feature or topic.
    </Fragment>
  )),
  new ChapterText(() => (
    <Fragment>
      Last but not least comes the <strong>Repository</strong>. Broadly speaking, this is the version database of your project.
    </Fragment>
  )),
];

@observer
class GitChapter extends Component {
  @computed get maxChanges() {
    const { chapter } = this.props;

    return Math.max(
      ...chapter.vis.files.map(file => file.changes),
    );
  }

  @computed get unstagedFiles() {
    const { chapter } = this.props;

    return chapter.vis.files.filter(file => !file.state.get('staged') && !file.state.get('committed'));
  }

  @computed get stagedFiles() {
    const { chapter } = this.props;

    return chapter.vis.files.filter(file => file.state.get('staged'));
  }

  @computed get committedFiles() {
    const { chapter } = this.props;

    return chapter.vis.files.filter(file => file.state.get('committed'));
  }

  constructor(props) {
    super();

    const { chapter } = props;

    extendObservable(chapter, {
      get hasWorkingDirectory() {
        return this.visibleTextSections > 1;
      },
      get hasStagingArea() {
        return this.visibleTextSections > 2;
      },
      get hasRepository() {
        return this.visibleTextSections > 3;
      },
    });
  }

  componentWillMount() {
    const { chapter } = this.props;

    this.addFilesDisposer = observe(chapter, 'hasWorkingDirectory', (change) => {
      if (change.newValue) {
        this.addFiles();
      }
    });

    this.copyFilesDisposer = observe(chapter, 'hasStagingArea', (change) => {
      if (change.newValue) {
        this.copyFiles()
      }
    });

    this.createCommitDisposer = observe(chapter, 'hasRepository', (change) => {
      if (change.newValue) {
        this.createCommit()
      }
    });
  }

  componentWillUnmount() {
    this.addFilesDisposer();
    this.copyFilesDisposer();
    this.createCommitDisposer();
  }

  @action addFiles() {
    const { chapter } = this.props;

    chapter.vis.files = [
      new VisualisationFileModel(),
      new VisualisationFileModel(),
      new VisualisationFileModel(),
    ];

    chapter.vis.files.forEach((file, index) => {
      file.status = STATUS_MODIFIED;
      file.modify();
    });
  }

  @action copyFiles() {
    const { chapter } = this.props;

    const baseFiles = chapter.vis.files.slice();
    const copies = chapter.vis.files.map(file => file.copy());

    baseFiles.forEach((file) => {
      file.reset();
    });

    copies.forEach((file) => {
      file.state.set('staged', true);
    })

    chapter.vis.files.push(...copies);
  }

  @action createCommit() {
    this.stagedFiles.forEach((file) => {
      file.state.set('staged', false);
      file.state.set('committed', true);
    });
  }

  renderVisualisation() {
    const { chapter, fontRegularCaps, fontBlack } = this.props;

    return (
      <Visualisation vis={chapter.vis}>
        {chapter.hasWorkingDirectory && <VisualisationArea column={0} height={1}>
          <VisualisationAreaName font={fontRegularCaps} name="Working Directory" />
          {this.unstagedFiles.map((file, index) => (
            <VisualisationFile file={file} key={file.id} level={index}>
              <VisualisationFileStatus file={file} font={fontBlack} maxChanges={this.maxChanges} />
            </VisualisationFile>
          ))}
        </VisualisationArea>}

        {chapter.hasStagingArea && <VisualisationArea column={1} height={1}>
          <VisualisationAreaName font={fontRegularCaps} name="Staging Area" />
          {this.stagedFiles.map((file, index) => (
            <VisualisationFile file={file} key={file.id} level={index}>
              <VisualisationFileStatus file={file} font={fontBlack} maxChanges={this.maxChanges} />
            </VisualisationFile>
          ))}
        </VisualisationArea>}

        {chapter.hasRepository && <VisualisationArea column={2} height={10} width={4}>
          <VisualisationAreaName font={fontRegularCaps} name="Repository" />
          {this.committedFiles.map((file, index) => (
            <VisualisationFile file={file} key={file.id} level={index}>
              <VisualisationFileStatus file={file} font={fontBlack} maxChanges={this.maxChanges} />
            </VisualisationFile>
          ))}
        </VisualisationArea>}
      </Visualisation>
    );
  }

  render() {
    const { chapter, tutorial } = this.props;



    return (
      <TutorialChapter
        tutorial={tutorial}
        chapter={chapter}
        sections={SECTIONS}
        onReadOn={this.handleReadOn}
      >
        {this.renderVisualisation()}
      </TutorialChapter>
    );
  }
}

export default GitChapter;

