import { observable } from 'mobx';

import VisualisationFileList from './VisualisationFileList';

class VisualisationCommit extends VisualisationFileList {
  @observable hoverCommit = false;
  @observable commitActive = false;
}

export default VisualisationCommit;
