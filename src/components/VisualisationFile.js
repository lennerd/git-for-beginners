import React, { PureComponent } from 'react';

import VisualisationObject3D from './VisualisationObject3D';
import { LEVEL_HEIGHT, CELL_HEIGHT, CELL_WIDTH } from '../theme';
import { withTheme } from 'styled-components';

export const FILE_SIZE_RATIO = 1 / Math.sqrt(2);
export const FILE_HEIGHT = LEVEL_HEIGHT / 2;
export const FILE_WIDTH = FILE_HEIGHT * 10;
export const FILE_DEPTH = FILE_WIDTH * FILE_SIZE_RATIO;

@withTheme
class VisualisationFile extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    row: 0,
    appear: false,
    statusType: null,
  };

  constructor(props) {
    super();

    const { theme } = props;

    this.fileObject = new THREE.Group();

    this.fileMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH),
      new THREE.MeshLambertMaterial(),
    );

    const outline = 0.015;

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH + outline, FILE_HEIGHT + outline, FILE_DEPTH + outline),
      new THREE.MeshBasicMaterial({ opacity: 1, transparent: true, depthWrite: false, color: theme.color.highlight, side: THREE.BackSide }),
    );

    this.hoverMesh.material.visible = false;

    this.shadowMash = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH, FILE_HEIGHT * 2, FILE_DEPTH),
      new THREE.ShadowMaterial({ depthWrite: false }),
    );

    this.fileMesh.position.y = FILE_HEIGHT / 2;

    // Shift a little to the back by outline to have no border between moving clones.
    this.hoverMesh.position.y = FILE_HEIGHT / 2 - outline;
    this.hoverMesh.position.x = outline;
    this.hoverMesh.position.z = outline;

    this.shadowMash.castShadow = true;
    this.shadowMash.position.y = 0.1;

    this.fileObject.add(this.shadowMash);
    this.fileObject.add(this.hoverMesh);
    this.fileObject.add(this.fileMesh);
  }

  render() {
    const { children, column, row, level } = this.props;

    this.fileObject.position.x = CELL_HEIGHT * row;
    this.fileObject.position.z = CELL_WIDTH * column;
    this.fileObject.position.y = LEVEL_HEIGHT * level;

    return (
      <VisualisationObject3D object3D={this.fileObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationFile;
