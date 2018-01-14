import React, { PureComponent } from 'react';
import { withTheme } from 'styled-components';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, CELL_WIDTH } from '../theme';
import { AREA_VERTICAL_PADDING } from './VisualisationArea';

const SECTION_LABEL_SIZE = 0.12;

@withTheme
class VisualisationAreaName extends PureComponent {
  static defaultProps = {
    width: 1,
  };

  constructor(props) {
    super();

    const { theme } = props;

    this.areaNameObject = new THREE.Group();

    this.textGeometry = new THREE.BufferGeometry();

    this.textMesh = new THREE.Mesh(
      this.textGeometry,
      new THREE.MeshBasicMaterial({
        color: theme.color.highlight,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      }),
    );

    this.textMesh.position.x = (CELL_HEIGHT * -0.5) - SECTION_LABEL_SIZE - 0.2;
    this.textMesh.position.y = 0.001;
    this.textMesh.rotation.x = Math.PI / -2;
    this.textMesh.rotation.z = Math.PI / -2;

    this.areaNameObject.add(this.textMesh);
  }

  render() {
    const { font, name, width } = this.props;

    const shapes = font.generateShapes(name.toUpperCase(), SECTION_LABEL_SIZE, 2);

    const geometry = new THREE.ShapeGeometry(shapes);

    //geometry.computeBoundingBox();
    //const xMid = (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / -2;
    geometry.translate(((width * CELL_WIDTH) / -2) - (AREA_VERTICAL_PADDING / -2), 0, 0);

    this.textGeometry.fromGeometry(geometry);

    return (
      <VisualisationObject3D object3D={this.areaNameObject} />
    );
  }
}

export default VisualisationAreaName;
