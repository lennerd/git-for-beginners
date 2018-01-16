import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Chapter, { ChapterMain } from './Chapter';
import ChapterHeader from './ChapterHeader';
import ChapterBody from './ChapterBody';
import ChapterNext from './ChapterNext';
import ChapterConsole from './ChapterConsole';
import Visualisation from './Visualisation';
import VisualisationFile from './VisualisationFile';
import VisualisationFileStatus from './VisualisationFileStatus';
import VisualisationFileName from './VisualisationFileName';
import VisualisationArea from './VisualisationArea';
import VisualisationAreaName from './VisualisationAreaName';
import VisualisationFileList from './VisualisationFileList';
import VisualisationCommit from './VisualisationCommit';

@observer
class TutorialChapter extends Component {
  renderVisualisation() {
    const { chapter, fontBlack, fontRegular, fontRegularCaps } = this.props;

    return (
      <Visualisation vis={chapter.vis}>
        {chapter.vis.fileLists.map((fileList, index) => (
          <VisualisationFileList fileList={fileList} key={index}>
            {fileList.files.map((file, index) => (
              file.visible && <VisualisationFile
                key={index}
                vis={chapter.vis}
                file={file}
              >
                <VisualisationFileStatus font={fontBlack} file={file} maxChanges={fileList.maxChanges} />
                {file.name != null && <VisualisationFileName font={fontRegular} name={file.name} />}
              </VisualisationFile>
            ))}
          </VisualisationFileList>
        ))}
        {chapter.vis.commits.map((commit, index) => (
          <VisualisationCommit commit={commit} key={index} vis={chapter.vis}>
            {commit.files.map((file, index) => (
              file.visible && <VisualisationFile
                key={index}
                vis={chapter.vis}
                file={file}
              >
                <VisualisationFileStatus font={fontBlack} file={file} maxChanges={commit.maxChanges} />
                {file.name != null && <VisualisationFileName font={fontRegular} name={file.name} />}
              </VisualisationFile>
            ))}
          </VisualisationCommit>
        ))}
        {chapter.vis.files.map((file, index) => (
          file.visible && <VisualisationFile
            key={index}
            vis={chapter.vis}
            file={file}
          >
            <VisualisationFileStatus font={fontBlack} file={file} />
            {file.name != null && <VisualisationFileName font={fontRegular} name={file.name} />}
          </VisualisationFile>
        ))}
        {chapter.vis.areas.map((area, index) => (
          <VisualisationArea area={area} key={index}>
            <VisualisationAreaName font={fontRegularCaps} name={area.name} />
          </VisualisationArea>
        ))}
      </Visualisation>
    );
  }

  render() {
    const { chapter, tutorial, children } = this.props;

    return (
      <Chapter>
        <ChapterMain>
          <ChapterHeader tutorial={tutorial} chapter={chapter} />
          <ChapterBody
            chapter={chapter}
          />
        </ChapterMain>
        {children}
        {chapter.commands != null && <ChapterConsole commands={chapter.commands} />}
        {chapter.vis != null && this.renderVisualisation()}
        <ChapterNext tutorial={tutorial} chapter={chapter} />
      </Chapter>
    );
  }
}

export default TutorialChapter;
