import { computed } from "mobx";

import VisualisationObject from "./VisualisationObject";

class BranchVisualisation extends VisualisationObject {
  isBranch = true;

  constructor(vis, branch) {
    super();

    this.vis = vis;
    this.branch = branch;
  }

  @computed get visCommits() {
    return this.filter(object => object.isCommit);
  }
}

export default BranchVisualisation;
