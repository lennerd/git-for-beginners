import { computed } from 'mobx';
import uniq from 'lodash/uniq';
import findLast from 'lodash/findLast';

import VisualisationObject from './VisualisationObject';

class BranchVisualisation extends VisualisationObject {
  isBranch = true;

  constructor(vis, branch) {
    super();

    this.vis = vis;
    this.branch = branch;
  }

  @computed
  get visCommits() {
    return this.filter(object => object.isCommit);
  }

  @computed
  get commits() {
    const commits = [];

    // Branch has no commits
    if (this.branch.commit == null) {
      return commits;
    }

    let parents = [this.branch.commit];

    // Walk up all parents and their parents to collect commits.
    while (parents.length > 0) {
      commits.push(...parents);
      parents = [].concat(...parents.map(parent => parent.parents));
    }

    return uniq(commits);
  }

  @computed
  get completeVisCommits() {
    return this.commits.map(commit =>
      this.vis.repository.visCommits.find(
        visCommit => visCommit.commit === commit,
      ),
    );
  }

  @computed
  get lastVisCommit() {
    return this.completeVisCommits.find(
      visCommit => visCommit.files.length > 0,
    );
  }

  @computed
  get checkedOut() {
    return this.branch === this.vis.repo.head;
  }

  @computed
  get offset() {
    const visBranchesOnLastCommit = this.vis.visBranches.filter(
      visBranch => visBranch.lastVisCommit === this.lastVisCommit,
    );

    if (visBranchesOnLastCommit.length === 1) {
      return 0;
    }

    visBranchesOnLastCommit.sort((a, b) => a.compare(b));

    return (
      visBranchesOnLastCommit.indexOf(this) - visBranchesOnLastCommit.length / 2
    );
  }

  compare(otherVisBranch) {
    if (this.checkedOut) {
      return -1;
    }

    if (otherVisBranch.checkedOut) {
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
