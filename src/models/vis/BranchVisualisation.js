import { computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';

import VisualisationObject from './VisualisationObject';

class BranchVisualisation extends VisualisationObject {
  isBranch = true;

  constructor(vis, branch) {
    super();

    this.vis = vis;
    this.branch = branch;
  }

  @computed
  get commits() {
    const commits = [];
    let parent = this.branch.commit;

    while (parent != null) {
      commits.push(parent);
      parent = parent.parent;
    }

    return commits;
  }

  @computed
  get visCommits() {
    const commits = takeWhile(this.commits, commit => {
      if (commit === this.branch.commit) {
        return true;
      }

      const otherVisBranchesWithCommit = this.otherVisBranches.filter(
        visBranch => visBranch.commits.includes(commit),
      );

      if (otherVisBranchesWithCommit.length === 0) {
        return true;
      }

      for (let otherVisBranch of otherVisBranchesWithCommit) {
        if (this.compare(otherVisBranch) === -1) {
          return true;
        }
      }

      return false;
    });

    // To link branches, add one more commit.
    const lastCommit = commits[commits.length - 1];
    if (lastCommit.parent != null) {
      commits.push(lastCommit.parent);
    }

    return this.vis.repository.filter(
      object => object.isCommit && commits.includes(object.commit),
    );
  }

  getPosition() {
    return this.lastVisCommit.position;
  }

  @computed
  get lastVisCommit() {
    return this.visCommits[this.visCommits.length - 1];
  }

  @computed
  get otherVisBranches() {
    return this.vis.repository.filter(
      object => object.isBranch && object !== this,
    );
  }

  @computed
  get isHead() {
    return this.branch === this.vis.repo.head;
  }

  compare(otherVisBranch) {
    if (this.isHead) {
      return -1;
    }

    if (otherVisBranch.isHead) {
      return 1;
    }

    if (this.branch.name < otherVisBranch.branch.name) {
      return -1;
    }

    if (this.branch.name > otherVisBranch.branch.name) {
      return 1;
    }

    return 0;
  }
}

export default BranchVisualisation;
