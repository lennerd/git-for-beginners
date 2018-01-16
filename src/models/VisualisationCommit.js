import { observable } from 'mobx';

import VisualisationFileList from './VisualisationFileList';

class VisualisationCommit extends VisualisationFileList {
  @observable active = false;
  @observable hover = false;
}

export default VisualisationCommit;
