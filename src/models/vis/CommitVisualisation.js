import { computed } from "mobx";

import VisualisationFileList from "./VisualisationFileList";

class CommitVisualisation extends VisualisationFileList {
  isContainer = true;
  isCommit = true;

  constructor(vis, branch, commit) {
    super();

    this.vis = vis;
    this.branch = branch;
    this.commit = commit;
  }

  getPosition() {
    const position = super.getPosition();

    position.row += (
      this.parent.children.length - (this.parent.children.indexOf(this) + 1)
    );

    return position;
  }

  @computed get visParent() {
    return this.parent.find(object => object.isCommit && object.commit === this.commit.parent);
  }

  @computed get tree() {
    return this.commit.tree;
  }

  @computed get parentTree() {
    if (this.commit.parent != null) {
      return this.commit.parent.tree;
    }

    return null;
  }
}

export default CommitVisualisation;
