import VisualisationArea from "./VisualisationArea";

class VisualisationStagingArea extends VisualisationArea {
  isStagingArea = true;

  constructor() {
    super('Staging Area');
  }
}

export default VisualisationStagingArea;
