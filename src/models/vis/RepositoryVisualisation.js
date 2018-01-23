import { computed } from "mobx";

import VisualisationArea from "./VisualisationArea";
import BranchVisualisation from "./BranchVisualisation";

class RepositoryVisualisation extends VisualisationArea {
  constructor(vis, repo) {
    super('Repository');

    this.vis = vis;
    this.repo = repo;
    this.height = 10;
    this.width = 10;

    const visHead = new BranchVisualisation(vis, repo.head);
    this.add(visHead);
  }

  @computed get visCommits() {
    return this.filter(object => object.isCommit);
  }

  @computed get visBranches() {
    return this.filter(object => object.isBranch);
  }

  @computed get head() {
    return this.find(object => object.isBranch && object.branch === this.repo.head);
  }
}

export default RepositoryVisualisation;
