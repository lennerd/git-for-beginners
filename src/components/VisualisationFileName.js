import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import VisualisationObject3D from './VisualisationObject3D';
import { FILE_WIDTH } from './VisualisationFile';

const FILE_LABEL_SIZE = 0.13;

@withTheme
class VisualisationFileName extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
  };

  constructor(props) {
    super();

    const { theme } = props;

    this.fileLabelObject = new THREE.Group();
    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: theme.color.text,
      }),
    );

    this.textMesh.position.x = (FILE_WIDTH / -2) - FILE_LABEL_SIZE - 0.2;
    this.textMesh.position.y = 0.001;
    this.textMesh.rotation.x = Math.PI / -2;
    this.textMesh.rotation.z = Math.PI / -2;

    this.fileLabelObject.add(this.textMesh);
  }

  render() {
    const { font, name } = this.props;

    const shapes = font.generateShapes(name, FILE_LABEL_SIZE, 2);
    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();
    const xMid = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / -2;
    geometry.translate(xMid, 0, 0);

    this.textGeometry.fromGeometry(geometry);

    return (
      <VisualisationObject3D object3D={this.fileLabelObject} />
    );
  }
}

export default VisualisationFileName;
