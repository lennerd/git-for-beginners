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
class VisualisationBranch extends Component {
  constructor(props) {
    super(props);

    const { theme, branch } = props;

    console.log(branch);

    this.branchObject = new THREE.Group();

    /*this.lineGeometry = new LineGeometry();

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

    this.branchObject.add(this.lineObject);

    this.lineGeometry.update(this.linePath);
    this.prevLinePath = this.linePath;*/

    /*setTimeout(() => {
      this.lineMaterial.uniforms.opacity.value = 0.5;
    }, 2000);*/
  }

  /*componentDidMount() {
    this.disposePath = reaction(
      () => this.linePath,
      linePath => {
        parallel(
          ...linePath.map((lineSegment, index) => {
            return tween({
              from: this.prevLinePath[index] || lineSegment,
              to: lineSegment,
              duration: 1000,
              ease: easing.easeInOut,
            });
          }),
        ).start({
          update: linePath => {
            this.lineGeometry.update(linePath);
          },
          complete: () => {
            this.prevLinePath = linePath;
          },
        });
      },
      { equals: comparer.structural },
    );
  }

  componentWillUnmount() {
    this.disposePath();
  }

  @computed
  get linePath() {
    const { branch } = this.props;

    const linePath = branch.visCommits.map(commit => {
      const { row, column } = commit.position;

      return [
        (row - branch.position.row) * CELL_HEIGHT,
        (column - branch.position.column) * CELL_WIDTH,
      ];
    });

    return linePath;
  }*/

  render() {
    const { children, branch } = this.props;

    this.branchObject.position.set(
      CELL_HEIGHT * branch.position.row,
      LEVEL_HEIGHT * branch.position.level,
      CELL_WIDTH * branch.position.column,
    );

    return (
      <VisualisationObject3D object3D={this.branchObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationBranch;
