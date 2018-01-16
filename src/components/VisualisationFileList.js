import React, { Component } from 'react';
import { observer } from 'mobx-react';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, CELL_WIDTH } from '../theme';

@observer
class VisualisationFileList extends Component {
  constructor(props) {
    super();

    this.fileListObject = new THREE.Group();
  }

  render() {
    const { children, fileList } = this.props;

    this.fileListObject.position.x = CELL_HEIGHT * fileList.row;
    this.fileListObject.position.z = CELL_WIDTH * fileList.column;

    return (
      <VisualisationObject3D object3D={this.fileListObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationFileList;
