import { observable } from 'mobx';

import VisualisationObject from './VisualisationObject';

class VisualisationArea extends VisualisationObject {
  isArea = true;

  @observable width = 1;
  @observable height = 1;

  constructor(name) {
    super();

    this.name = name;
  }
}

export default VisualisationArea;
