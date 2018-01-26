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

  @computed
  get treePosition() {
    if (this.commit.parents.length === 0) {
      return { column: 0, row: 0 };
    }

    if (this.visParentCommits.length === 0) {
      throw new Error('No parent commits … :(');
    }

    let column = Infinity;
    let row = Infinity;

    for (let visParentCommit of this.visParentCommits) {
      column = Math.min(column, visParentCommit.treePosition.column);
      row = Math.min(row, visParentCommit.treePosition.row);

      if (visParentCommit.visChildCommits.length > 1) {
        const index = visParentCommit.visChildCommits.indexOf(this);

        if (index > 0) {
          const previousChildCommit =
            visParentCommit.visChildCommits[index - 1];
          column = previousChildCommit.treePosition.column + 1;
        }
      }
    }

    return {
      column,
      row: row - 1,
    };
  }

  getPosition() {
    const position = super.getPosition();
    const { column, row } = this.treePosition;
    const { row: rowHead } = this.vis.repository.visHeadCommit.treePosition;

    return {
      ...position,
      column: position.column + column,
      row: position.row + row - rowHead - this.vis.repository.treeRowOffset,
    };
  }

  @computed
  get visParentCommits() {
    if (this.commit.parents.lenght === 0) {
      return [];
    }

    return this.vis.repository.visCommits.filter(visCommit =>
      this.commit.parents.includes(visCommit.commit),
    );
  }

  @computed
  get visChildCommits() {
    const visChildCommits = this.vis.repository.visCommits.filter(visCommit =>
      visCommit.commit.parents.includes(this.commit),
    );

    visChildCommits.sort((a, b) => a.parent.compare(b.parent));

    return visChildCommits;
  }

  @computed
  get visBranch() {
    const visBranches = this.vis.visBranches.filter(visBranch =>
      visBranch.visCommits.includes(this),
    );

    if (visBranches.length !== 0) {
      throw new Error('Commit contained in multiple branches … :(');
    }

    return visBranches[0];
  }

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
