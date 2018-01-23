import { computed } from "mobx";

import VisualisationArea from "./VisualisationArea";
import VisualisationFileList from "./VisualisationFileList";

class WorkingDirectoryVisualisation extends VisualisationArea {
  isContainer = true;

  constructor(vis, repo) {
    super('Working Directory');

    this.vis = vis;
    this.repo = repo;

    this.fileList = new VisualisationFileList();
    this.add(this.fileList);
  }

  @computed get tree() {
    return this.repo.workingDirectory.tree;
  }

  @computed get parentTree() {
    return this.repo.stagingArea.tree;
  }
}

export default WorkingDirectoryVisualisation;
