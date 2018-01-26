import { computed } from 'mobx';

import VisualisationObject from './VisualisationObject';

class PointerVisualisation extends VisualisationObject {
  isPointer = true;

  constructor(vis, visCommit, visParentCommit) {
    super();

    this.vis = vis;
    this.visCommit = visCommit;
    this.visParentCommit = visParentCommit;
  }

  getPosition() {
    return this.visCommit.position;
  }
}

export default PointerVisualisation;
