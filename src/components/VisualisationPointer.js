import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { computed, comparer } from 'mobx';
import { withTheme } from 'styled-components';
import createLine from 'three-line-2d';
import createBasicShader from 'three-line-2d/shaders/basic';
import { reaction } from 'mobx';
import { tween, value, easing, parallel } from 'popmotion';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_WIDTH, CELL_HEIGHT, LEVEL_HEIGHT } from '../theme';

const LineGeometry = createLine(THREE);
const basicShader = createBasicShader(THREE);
const BRANCH_LINE_WIDTH = 0.15;

@withTheme
@observer
class VisualisationPointer extends Component {
  constructor(props) {
    super(props);

    const { theme } = props;

    this.pointerObject = new THREE.Group();

    this.lineGeometry = new LineGeometry();

    this.lineMaterial = new THREE.ShaderMaterial(
      basicShader({
        opacity: 0.5,
        transparent: true,
        diffuse: theme.color.highlight,
        thickness: BRANCH_LINE_WIDTH,
      }),
    );

    this.lineObject = new THREE.Mesh(this.lineGeometry, this.lineMaterial);
    this.lineObject.rotation.x = Math.PI / 2;

    this.pointerObject.add(this.lineObject);
  }

  @computed
  get linePath() {
    const { visPointer } = this.props;
    let { row, column } = visPointer.visCommit.position;
    const linePath = [
      [
        (row - visPointer.position.row) * CELL_HEIGHT,
        (column - visPointer.position.column) * CELL_WIDTH,
      ],
    ];

    if (visPointer.visParentCommit != null) {
      ({ row, column } = visPointer.visParentCommit.position);
      linePath.push([
        (row - visPointer.position.row) * CELL_HEIGHT,
        (column - visPointer.position.column) * CELL_WIDTH,
      ]);
    }

    return linePath;
  }

  render() {
    const { children, visPointer } = this.props;

    this.pointerObject.position.set(
      CELL_HEIGHT * visPointer.position.row,
      LEVEL_HEIGHT * visPointer.position.level,
      CELL_WIDTH * visPointer.position.column,
    );

    this.lineGeometry.update(this.linePath);

    return (
      <VisualisationObject3D object3D={this.pointerObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationPointer;
