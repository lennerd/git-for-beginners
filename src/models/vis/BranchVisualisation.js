import { computed } from 'mobx';
import takeWhile from 'lodash/takeWhile';
import uniq from 'lodash/uniq';

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

  /*@computed
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
  get visCommits() {
    // Collect all commits until false is returned
    const commits = takeWhile(this.commits, commit => {
      // Commit is head of branch
      if (commit === this.branch.commit) {
        return true;
      }

      // Collect all other branches containing this commit
      const otherVisBranchesWithCommit = this.otherVisBranches.filter(
        visBranch => visBranch.commits.includes(commit),
      );

      // If their is no other branch, this is settled.
      if (otherVisBranchesWithCommit.length === 0) {
        return true;
      }

      // Compare other branches and use the first one with the lower sort value.
      for (let otherVisBranch of otherVisBranchesWithCommit) {
        if (this.compare(otherVisBranch) === -1) {
          return true;
        }
      }

      return false;
    });

    return this.vis.repository.visCommits.filter(visCommit =>
      commits.includes(visCommit.commit),
    );
  }*/

  /*getPosition() {
    return this.visCommits[this.visCommits.length - 1];
  }*/

  /*@computed
  get lastVisCommit() {
    if (this.branch.commit == null) {
      return null;
    }

    return this.vis.repository.visCommits.find(
      visCommit => visCommit.commit === this.branch.commit,
    );
  }

  @computed
  get otherVisBranches() {
    return this.vis.repository.filter(
      object => object.isBranch && object !== this,
    );
  }*/

  @computed
  get lastVisCommit() {
    if (this.branch.commit == null) {
      return null;
    }

    return this.vis.repository.visCommits.find(
      visCommit => visCommit.commit === this.branch.commit,
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
