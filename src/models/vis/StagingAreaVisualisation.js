import { computed } from "mobx";

import VisualisationArea from "./VisualisationArea";
import VisualisationFileList from "./VisualisationFileList";

class StagingAreaVisualisation extends VisualisationArea {
  isContainer = true;

  constructor(vis, repo) {
    super('Staging Area');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.add(this.fileList);
  }

  @computed get tree() {
    return this.repo.stagingArea.tree;
  }

  @computed get parentTree() {
    if (this.repo.head.commit != null) {
      return this.repo.head.commit.tree;
    }

    return null;
  }
}

export default StagingAreaVisualisation;
