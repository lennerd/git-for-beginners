import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, LEVEL_HEIGHT, CELL_WIDTH } from '../theme';

export const AREA_VERTICAL_PADDING = CELL_WIDTH * 0.05;

@withTheme
class VisualisationSection extends PureComponent {
  static defaultProps = {
    column: 0,
    level: 0,
    row: 0,
    height: 1,
    width: 1,
  };

  constructor(props) {
    super();

    const { theme } = props;

    this.areaObject = new THREE.Group();

    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: theme.color.highlight, opacity: 0.1, transparent: true, depthWrite: false }),
    );

    this.planeMesh.rotation.x = Math.PI / -2;

    this.areaObject.add(this.planeMesh);
  }

  render() {
    const { children, column, row, level, width, height } = this.props;

    this.planeMesh.scale.set(
      CELL_HEIGHT * height,
      CELL_WIDTH * width - AREA_VERTICAL_PADDING,
      1
    );

    this.planeMesh.position.x = CELL_HEIGHT * ((height / 2) - 0.5);

    this.areaObject.position.set(
      CELL_HEIGHT * row,
      LEVEL_HEIGHT * level,
      CELL_WIDTH * column,
    );

    return (
      <VisualisationObject3D object3D={this.areaObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationSection;
