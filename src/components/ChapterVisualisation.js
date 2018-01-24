import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { TransitionGroup } from 'react-transition-group';

import Visualisation from './Visualisation';
import VisualisationFile from './VisualisationFile';
import VisualisationFileStatus from './VisualisationFileStatus';
import VisualisationFileName from './VisualisationFileName';
import VisualisationArea from './VisualisationArea';
import VisualisationAreaName from './VisualisationAreaName';
import VisualisationCommit from './VisualisationCommit';
import VisualisationPopup from './VisualisationPopup';

@observer
class ChapterVisualisation extends Component {
  render() {
    const { chapter, fontBlack, fontRegular, fontRegularCaps } = this.props;

    if (chapter.vis == null) {
      return null;
    }

    return (
      <Visualisation vis={chapter.vis}>
        {chapter.vis.visFileLists.map(commit => (
          <VisualisationCommit commit={commit} key={commit.id} vis={chapter.vis}>
            {commit.isCommit && <VisualisationPopup font={fontRegular} level={commit.height} content={commit.commit.checksumShort} in={commit.active} />}
          </VisualisationCommit>
        ))}
        <TransitionGroup component={Fragment}>
          {chapter.vis.visFiles.map(file => (
            <VisualisationFile key={file.id} vis={chapter.vis} file={file}>
              {file.diff != null && <VisualisationFileStatus font={fontBlack} file={file} vis={chapter.vis} />}
              {file.name != null && <VisualisationFileName font={fontRegular} name={file.name} />}
            </VisualisationFile>
          ))}
        </TransitionGroup>
        <TransitionGroup component={Fragment}>
          {chapter.vis.visAreas.map(area => (
            <VisualisationArea area={area} key={area.id}>
              <VisualisationAreaName font={fontRegularCaps} area={area} />
            </VisualisationArea>
          ))}
        </TransitionGroup>
      </Visualisation>
    );
  }
}

export default ChapterVisualisation;
