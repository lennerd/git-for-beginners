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

  @computed
  get checkedOut() {
    return this.vis.head.commits.includes(this.visCommit.commit);
  }
}

export default PointerVisualisation;
