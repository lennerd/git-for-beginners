import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { withTheme } from 'styled-components';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_HEIGHT, CELL_WIDTH, LEVEL_HEIGHT } from '../theme';
import { FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH } from './VisualisationFile';

const COMMIT_OUTLINE = 0.06;

@withTheme
@observer
class VisualisationCommit extends Component {
  constructor(props) {
    super();

    const { theme } = props;

    this.commitObject = new THREE.Group();

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(FILE_WIDTH + COMMIT_OUTLINE, 1, FILE_DEPTH + COMMIT_OUTLINE),
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: theme.color.highlight, side: THREE.BackSide }),
    );

    // Shift a little to the back by COMMIT_OUTLINE to have no border between moving clones.
    this.hoverMesh.position.x = COMMIT_OUTLINE;
    this.hoverMesh.position.z = COMMIT_OUTLINE;

    this.commitObject.add(this.hoverMesh);
  }

  @action.bound handleClick(event) {
    const { commit, vis } = this.props;

    vis.active = false;
    commit.directActive = !commit.directActive;

    event.stopPropagation();
  };

  @action.bound handleMouseEnter(event) {
    const { commit } = this.props;

    commit.directHover = true;
  };

  @action.bound handleMouseLeave(event) {
    const { commit } = this.props;

    commit.directHover = false;
  };

  render() {
    const { children, commit } = this.props;

    this.commitObject.position.set(
      CELL_HEIGHT * commit.position.row,
      LEVEL_HEIGHT * commit.position.level,
      CELL_WIDTH * commit.position.column,
    );

    this.commitObject.visible = commit.visible;

    const height = commit.height * FILE_HEIGHT + (commit.height - 1) * (LEVEL_HEIGHT - FILE_HEIGHT);

    this.hoverMesh.scale.y = height + COMMIT_OUTLINE;
    this.hoverMesh.position.y = height / 2 - COMMIT_OUTLINE;

    this.hoverMesh.material.visible = commit.hover || commit.active;
    this.hoverMesh.material.opacity = commit.active ? 0.3 : 0.1;

    return (
      <VisualisationObject3D
        object3D={this.commitObject}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationCommit;
