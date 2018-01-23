import { computed } from "mobx";

import VisualisationFileList from "./VisualisationFileList";

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

    position.row += (
      this.parent.children.length - (this.parent.children.indexOf(this) + 1)
    );

    return position;
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
