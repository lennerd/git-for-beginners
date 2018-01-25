import { computed } from 'mobx';

import VisualisationFileList from './VisualisationFileList';

class CommitVisualisation extends VisualisationFileList {
  isContainer = true;
  isCommit = true;

  constructor(vis, commit) {
    super();

    this.vis = vis;
    this.commit = commit;
  }

  getPosition() {
    const position = super.getPosition();

    /*if (this.onHead) {
      // Vis commit is head of head branch
      if (this.vis.repo.head.commit === this.commit) {
        return position;
      }

      // Vis commit is on head, so go up the head branch and
      // get the first child position
      const child = this.visCommitChildren.find(visCommit => visCommit.onHead);
      position.row = child.position.row + 1;

      return position;
    }

    const parentPosition = this.visParentCommit.position;

    // Same branch like parent commit.
    if (
      this.visBranches.some(visBranch =>
        this.visParentCommit.visParentCommit.visBranches.includes(visBranch),
      )
    ) {
      position.row = parentPosition.row - 1;
      position.column = parentPosition.column;
      // Parent on other branch.
    } else {
      position.row = parentPosition.row - 1;
      position.column = parentPosition.column + 1;
    }*/

    position.row +=
      this.parent.visCommits.length -
      (this.parent.visCommits.indexOf(this) + 1);

    return position;
  }

  /*@computed
  get visParentCommit() {
    if (this.commit.parent == null) {
      return null;
    }

    return this.vis.repository.find(
      object => object.isCommit && object.commit === this.commit.parent,
    );
  }

  @computed
  get visCommitChildren() {
    return this.vis.repository.filter(
      object => object.isCommit && object.commit.parent === this.commit,
    );
  }

  @computed
  get visBranches() {
    return this.vis.repository.filter(
      object => object.isBranch && object.visCommits.includes(this),
    );
  }

  @computed
  get onHead() {
    return this.visBranches.some(
      visBranch => visBranch.branch === this.vis.repo.head,
    );
  }*/

  @computed
  get tree() {
    return this.commit.tree;
  }

  @computed
  get parentTrees() {
    if (this.commit.parents.length) {
      return this.commit.parents.map(parent => parent.tree);
    }

    return [];
  }
}

export default CommitVisualisation;
