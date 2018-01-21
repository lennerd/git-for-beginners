import VisualisationObject from './VisualisationObject';

class VisualisationFile extends VisualisationObject {
  isFile = true;

  getPosition() {
    const position = super.getPosition();

    if (this.parent != null && this.parent.isFileList) {
      const level = this.parent.uniqueFiles.findIndex(fileVis => (
        fileVis.file === this.file
      ));

      position.level += level;
    }

    return position;
  }
}

export default VisualisationFile;
