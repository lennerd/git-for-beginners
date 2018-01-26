import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTheme } from 'styled-components';

import VisualisationObject3D from './VisualisationObject3D';
import { CELL_WIDTH, CELL_HEIGHT, LEVEL_HEIGHT } from '../theme';

@withTheme
@observer
class VisualisationBranch extends Component {
  constructor(props) {
    super(props);

    this.branchObject = new THREE.Group();
  }

  render() {
    const { children, branch } = this.props;

    this.branchObject.position.set(
      CELL_HEIGHT * branch.lastVisCommit.position.row,
      LEVEL_HEIGHT * branch.lastVisCommit.position.level,
      CELL_WIDTH * branch.lastVisCommit.position.column,
    );

    return (
      <VisualisationObject3D object3D={this.branchObject}>
        {children}
      </VisualisationObject3D>
    );
  }
}

export default VisualisationBranch;
