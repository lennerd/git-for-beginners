import VisualisationArea from "./VisualisationArea";

class VisualisationWorkingDirectory extends VisualisationArea {
  isWorkingDirectory = true;

  constructor() {
    super('Working Directory');
  }
}

export default VisualisationWorkingDirectory;
