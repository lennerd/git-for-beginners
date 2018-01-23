import { computed } from "mobx";

import VisualisationArea from "./VisualisationArea";

class RepositoryVisualisation extends VisualisationArea {
  constructor(vis, repo) {
    super('Repository');

    this.vis = vis;
    this.repo = repo;
    this.height = 10;
    this.width = 10;
  }

  @computed get commits() {
    return this.filter(object => object.isCommit);
  }
}

export default RepositoryVisualisation;
