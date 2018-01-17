import { computed } from 'mobx';

import VisualisationArea from "./VisualisationArea";

class VisualisationRepository extends VisualisationArea {
  isRepository = true;

  constructor() {
    super('Repository');
  }

  @computed get commits() {
    return this.filter(object => object.isCommit);
  }
}

export default VisualisationRepository;
