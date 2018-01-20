import VisualisationObject from './VisualisationObject';

class VisualisationFile extends VisualisationObject {
  isFile = true;

  getPosition() {
    const position = super.getPosition();

    if (this.parent != null && this.parent.isFileList) {
      position.level += this.parent.files.indexOf(this);
    }

    return position;
  }
}

export default VisualisationFile;
