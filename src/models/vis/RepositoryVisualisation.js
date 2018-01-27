import { computed } from 'mobx';

import VisualisationArea from './VisualisationArea';

class RepositoryVisualisation extends VisualisationArea {
  constructor(vis, repo) {
    super('Repository');

    this.vis = vis;
    this.repo = repo;
    this.height = 1000;
    this.width = 100;
  }

  @computed
  get visCommits() {
    return this.filter(object => object.isCommit);
  }

  @computed
  get visBranches() {
    return this.filter(object => object.isBranch);
  }

  @computed
  get visHeadCommit() {
    return this.visCommits.find(
      visCommit => visCommit.commit === this.vis.repo.head.commit,
    );
  }

  @computed
  get treeRowOffset() {
    if (this.visHeadCommit == null) {
      return 0;
    }

    const minRow = Math.min(
      ...this.visCommits.map(visCommit => visCommit.treePosition.row),
    );

    return minRow - this.visHeadCommit.treePosition.row;
  }

  getPosition() {
    const position = super.getPosition();

    position.row += this.treeRowOffset;

    return position;
  }
}

export default RepositoryVisualisation;
